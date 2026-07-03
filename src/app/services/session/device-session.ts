import { Injectable } from '@angular/core';
import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


export interface DeviceInfo {
  deviceId: string;
  platform: string;
  deviceName: string;
  osVersion: string;
}


export interface LocationInfo {
  ip: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
}


interface IpResult {
  ip: string;
  country: string;
}


interface CoordsResult {
  latitude: number;
  longitude: number;
}


@Injectable({
  providedIn: 'root',
})
export class DeviceSession {


  constructor() {}


  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------


  getDeviceInfo(): Observable<DeviceInfo> {
    return of({
      deviceId:   this.generateDeviceId(),
      platform:   this.getPlatform(),
      deviceName: this.getDeviceName(),
      osVersion:  this.getOSVersion(),
    });
  }


  /**
   * Runs IP lookup and geolocation IN PARALLEL via forkJoin.
   * Both always resolve — never throw — so login is never blocked.
   */
  getLocationInfo(): Observable<LocationInfo> {
    return forkJoin({
      ipInfo: this.fetchIpInfo(),
      coords: this.fetchBrowserCoords(),
    }).pipe(
      map(({ ipInfo, coords }) => {
        const result: LocationInfo = {
          ip:        ipInfo.ip,
          country:   ipInfo.country,
          timezone:  Intl.DateTimeFormat().resolvedOptions().timeZone,
          latitude:  coords.latitude,
          longitude: coords.longitude,
        };
        console.log('[DeviceSession] locationInfo resolved:', result);
        return result;
      })
    );
  }


  // ---------------------------------------------------------------------------
  // IP Info — tries 3 providers in sequence, stops at first success
  // ---------------------------------------------------------------------------


  /**
   * Provider chain (all support CORS from browser):
   *   1. cloudflare-ipv4 trace  → fastest, always IPv4, no JSON needed
   *   2. ipwho.is               → JSON, returns ip + country_code
   *   3. ip-api.com             → JSON fallback (HTTP only, works on HTTP pages too)
   *
   * Falls back to { ip: '', country: timezone-derived country } if all fail.
   */
  private fetchIpInfo(): Observable<IpResult> {
    return from(this.fetchIpInfoAsync()).pipe(
      catchError(err => {
        console.warn('[DeviceSession] fetchIpInfo failed entirely:', err);
        return of({ ip: '', country: this.countryFromTimezone() });
      })
    );
  }


  private async fetchIpInfoAsync(): Promise<IpResult> {


    // --- Provider 1: Cloudflare trace (fastest, always IPv4) ---
    try {
      const res  = await fetch('https://1.1.1.1/cdn-cgi/trace');
      const text = await res.text();
      // Response is plain text: "ip=1.2.3.4\ncountry=IN\n..."
      const ipMatch  = text.match(/ip=([^\n]+)/);
      const locMatch = text.match(/loc=([^\n]+)/);
      if (ipMatch && locMatch) {
        const ip      = ipMatch[1].trim();
        const country = locMatch[1].trim();
        console.log('[DeviceSession] IP via Cloudflare:', ip, country);
        return { ip, country };
      }
    } catch (e) {
      console.warn('[DeviceSession] Cloudflare trace failed:', e);
    }


    // --- Provider 2: ipwho.is (JSON, CORS-friendly) ---
    try {
      const res  = await fetch('https://ipwho.is/');
      const data = await res.json();
      if (data?.ip && data?.country_code) {
        console.log('[DeviceSession] IP via ipwho.is:', data.ip, data.country_code);
        return { ip: data.ip, country: data.country_code };
      }
    } catch (e) {
      console.warn('[DeviceSession] ipwho.is failed:', e);
    }


    // --- Provider 3: ip-api.com (JSON fallback) ---
    try {
      const res  = await fetch('http://ip-api.com/json/?fields=query,countryCode');
      const data = await res.json();
      if (data?.query && data?.countryCode) {
        console.log('[DeviceSession] IP via ip-api.com:', data.query, data.countryCode);
        return { ip: data.query, country: data.countryCode };
      }
    } catch (e) {
      console.warn('[DeviceSession] ip-api.com failed:', e);
    }


    // All providers failed — return empty with timezone-based country guess
    console.warn('[DeviceSession] All IP providers failed. Using timezone fallback.');
    return { ip: '', country: this.countryFromTimezone() };
  }


  // ---------------------------------------------------------------------------
  // Browser Geolocation
  // ---------------------------------------------------------------------------


  /**
   * Wraps navigator.geolocation.getCurrentPosition in a Promise.
   * Always resolves — returns {0, 0} only if:
   *   - User explicitly DENIES the permission popup, OR
   *   - Browser doesn't support geolocation.
   *
   * NOTE: Firefox will show a permission bar at top of page.
   *       The Promise waits indefinitely until user clicks Allow/Block.
   *       We add a 15s safety timeout to avoid hanging the login call.
   */
  private fetchBrowserCoords(): Observable<CoordsResult> {
    return from(this.fetchCoordsAsync()).pipe(
      catchError(err => {
        console.warn('[DeviceSession] Coords fetch error:', err);
        return of({ latitude: 0, longitude: 0 });
      })
    );
  }


  private fetchCoordsAsync(): Promise<CoordsResult> {
    return new Promise(resolve => {
      if (!navigator.geolocation) {
        console.warn('[DeviceSession] Geolocation API not available.');
        resolve({ latitude: 0, longitude: 0 });
        return;
      }


      // Safety timeout — if user ignores the permission prompt for 15s, move on
      const timeout = setTimeout(() => {
        console.warn('[DeviceSession] Geolocation timed out waiting for user permission.');
        resolve({ latitude: 0, longitude: 0 });
      }, 15000);


      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeout);
          const coords = {
            latitude:  position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log('[DeviceSession] Coords resolved:', coords);
          resolve(coords);
        },
        (error) => {
          clearTimeout(timeout);
          console.warn('[DeviceSession] Geolocation error:', error.code, error.message);
          // error.code: 1 = PERMISSION_DENIED, 2 = UNAVAILABLE, 3 = TIMEOUT
          resolve({ latitude: 0, longitude: 0 });
        },
        {
          enableHighAccuracy: true,
          timeout:    12000,  // give GPS/network 12s to get a fix
          maximumAge: 300000, // accept a cached position up to 5 min old
        }
      );
    });
  }


  // ---------------------------------------------------------------------------
  // Timezone → Country fallback (when ALL IP providers fail)
  // ---------------------------------------------------------------------------


  /**
   * Maps IANA timezone to ISO country code.
   * Covers the most common timezones — much more reliable than locale parsing.
   */
  private countryFromTimezone(): string {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;


    const map: Record<string, string> = {
      'Asia/Kolkata':          'IN',
      'Asia/Calcutta':         'IN',
      'Asia/Colombo':          'LK',
      'Asia/Karachi':          'PK',
      'Asia/Dhaka':            'BD',
      'Asia/Kathmandu':        'NP',
      'Asia/Kabul':            'AF',
      'Asia/Dubai':            'AE',
      'Asia/Riyadh':           'SA',
      'Asia/Kuwait':           'KW',
      'Asia/Baghdad':          'IQ',
      'Asia/Tehran':           'IR',
      'Asia/Istanbul':         'TR',
      'Asia/Jerusalem':        'IL',
      'Asia/Beirut':           'LB',
      'Asia/Amman':            'JO',
      'Asia/Shanghai':         'CN',
      'Asia/Hong_Kong':        'HK',
      'Asia/Singapore':        'SG',
      'Asia/Tokyo':            'JP',
      'Asia/Seoul':            'KR',
      'Asia/Bangkok':          'TH',
      'Asia/Jakarta':          'ID',
      'Asia/Manila':           'PH',
      'Asia/Kuala_Lumpur':     'MY',
      'Asia/Yangon':           'MM',
      'Asia/Almaty':           'KZ',
      'Asia/Tashkent':         'UZ',
      'Asia/Tbilisi':          'GE',
      'Asia/Yerevan':          'AM',
      'Asia/Baku':             'AZ',
      'Europe/London':         'GB',
      'Europe/Paris':          'FR',
      'Europe/Berlin':         'DE',
      'Europe/Madrid':         'ES',
      'Europe/Rome':           'IT',
      'Europe/Moscow':         'RU',
      'Europe/Amsterdam':      'NL',
      'Europe/Brussels':       'BE',
      'Europe/Vienna':         'AT',
      'Europe/Warsaw':         'PL',
      'Europe/Prague':         'CZ',
      'Europe/Budapest':       'HU',
      'Europe/Bucharest':      'RO',
      'Europe/Sofia':          'BG',
      'Europe/Athens':         'GR',
      'Europe/Helsinki':       'FI',
      'Europe/Stockholm':      'SE',
      'Europe/Oslo':           'NO',
      'Europe/Copenhagen':     'DK',
      'Europe/Lisbon':         'PT',
      'Europe/Zurich':         'CH',
      'Europe/Dublin':         'IE',
      'Europe/Kyiv':           'UA',
      'America/New_York':      'US',
      'America/Chicago':       'US',
      'America/Denver':        'US',
      'America/Los_Angeles':   'US',
      'America/Phoenix':       'US',
      'America/Anchorage':     'US',
      'America/Honolulu':      'US',
      'America/Toronto':       'CA',
      'America/Vancouver':     'CA',
      'America/Montreal':      'CA',
      'America/Sao_Paulo':     'BR',
      'America/Buenos_Aires':  'AR',
      'America/Santiago':      'CL',
      'America/Bogota':        'CO',
      'America/Lima':          'PE',
      'America/Mexico_City':   'MX',
      'America/Caracas':       'VE',
      'Africa/Cairo':          'EG',
      'Africa/Lagos':          'NG',
      'Africa/Johannesburg':   'ZA',
      'Africa/Nairobi':        'KE',
      'Africa/Casablanca':     'MA',
      'Africa/Addis_Ababa':    'ET',
      'Pacific/Auckland':      'NZ',
      'Pacific/Sydney':        'AU',  // note: Sydney is in Australia
      'Australia/Sydney':      'AU',
      'Australia/Melbourne':   'AU',
      'Australia/Brisbane':    'AU',
      'Australia/Perth':       'AU',
    };


    const country = map[tz];
    if (country) {
      console.log(`[DeviceSession] Timezone fallback: ${tz} → ${country}`);
      return country;
    }


    console.warn(`[DeviceSession] Unknown timezone: ${tz}, returning Unknown`);
    return 'Unknown';
  }


  // ---------------------------------------------------------------------------
  // Device helpers
  // ---------------------------------------------------------------------------


  private generateDeviceId(): string {
    const stored = localStorage.getItem('deviceId');
    if (stored) return stored;


    const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });


    localStorage.setItem('deviceId', id);
    return id;
  }


  private getPlatform(): string {
    return 'web';
  }


  /**
   * Check Edge/Opera/Samsung BEFORE Chrome — their UA strings also contain "Chrome".
   */
  private getDeviceName(): string {
    const ua = navigator.userAgent;
    if (/Edg\//.test(ua))           return 'Edge Browser';
    if (/OPR\//.test(ua))           return 'Opera Browser';
    if (/SamsungBrowser/.test(ua))  return 'Samsung Browser';
    if (/Chrome\//.test(ua))        return 'Chrome Browser';
    if (/Firefox\//.test(ua))       return 'Firefox Browser';
    if (/Safari\//.test(ua))        return 'Safari Browser';
    if (/Trident\/|MSIE /.test(ua)) return 'Internet Explorer Browser';
    return 'Unknown Browser';
  }


  /**
   * Check Android/iOS BEFORE Linux/Mac — Android UA contains "Linux",
   * some iOS UA strings contain "Mac OS X".
   */
  private getOSVersion(): string {
    const ua = navigator.userAgent;
    if (/Android/.test(ua))          return 'Android';
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
    if (/Windows NT/.test(ua))       return 'Windows';
    if (/Mac OS X/.test(ua))         return 'macOS';
    if (/CrOS/.test(ua))             return 'ChromeOS';
    if (/Linux/.test(ua))            return 'Linux';
    return 'Unknown OS';
  }
}


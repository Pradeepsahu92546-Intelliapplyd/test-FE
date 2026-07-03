// src/app/services/auth/auth.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, delay, forkJoin } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  LoginResponse,
  RegisterResponse,
  ForgotPasswordResponse,
  ActivationResponse,
} from '../../dto/interfaces/auth.interface';
import { environment } from '../../../environments/environment';
import { SessionStorage } from '../session/session-storage';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DeviceSession } from '../session/device-session';

// auth service to handle user authentication

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // Signal for UI components to react to login state
  public isUserAuthenticated = signal<boolean>(false);

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionStorage: SessionStorage,
    private notification: NzNotificationService,
    private deviceSession: DeviceSession,
  ) {
    if (this.sessionStorage.hasValidToken()) {
      this.isUserAuthenticated.set(true);
    }
  }
  // Base URL from environment configuration
  get baseUrl(): string {
    return environment.apiUrl;
  }

  setToken(token: string) {
    console.log('Getting tokendata from login', token);
    this.sessionStorage.setAccessToken(token);
    this.isUserAuthenticated.set(true);
  }

  getToken(): string | null {
    const token = this.sessionStorage.getAccessToken();
    console.log('Getting token from session storage:', token ? '***' : 'null');
    return token;
  }

  setUserEmail(email: string) {
    this.sessionStorage.setUserEmail(email);
  }

  getUserEmail(): string | null {
    return this.sessionStorage.getUserEmail();
  }

  setVerificationToken(token: string, expiresInSeconds?: number) {
    this.sessionStorage.setVerificationToken(token, expiresInSeconds);
  }

  getVerificationToken(): string | null {
    return this.sessionStorage.getVerificationToken();
  }

  // ---- auth api list ----

  logout() {
    // Clear session storage before logout
    const url = `${this.baseUrl}/v1/auth/logout/`;

    return this.http.post(url, {}, this.httpOptions).pipe(
      tap(() => {
        this.sessionStorage.clearAll();
        this.isUserAuthenticated.set(false);
        this.notification.success(
          'Logged out',
          'You have been logged out successfully.',
        );
        this.router.navigate(['/auth']);
      }),
    );
  }

  // get accounttype and usertype (meta data for registration)(this is public api so token is not required sending a+)
  getAccountAndUserType(): Observable<any> {
    // mock rresponse
    // const mockResponse = {
    //   status: 'success',
    //   code: 200,
    //   message: 'Metadata fetched successfully',
    //   data: {
    //     userTypes: [
    //       'individual',
    //       'expert',
    //       'freelancer',
    //       'company',
    //       'business',
    //     ],
    //     accountTypes: ['standard', 'enterprise'],
    //   },
    //   meta: {
    //     requestId: 'req-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // };

    const url = `${this.baseUrl}/v1/accounts/registration-metadata/`;
    return this.http.get(url, this.httpOptions);
  }

  /** Activate account via token from email link
   *  GET /api/v1/accounts/activate/?token=<token>
   *  Success response shape:
   *  { status, code: 200, message, data: {}, meta: {}, requestId, timestamp }
   */
  activateAccount(token: string): Observable<any> {
    // mock response for testing
    // const mockResponse = {
    //   status: 'success',
    //   code: 200,
    //   message: 'Account activated successfully',
    //   data: {},
    //   meta: {
    //     requestId: 'req-12345',
    //     timestamp: new Date().toISOString(),
    //   },
    // };

    // return of(mockResponse);
    const url = `${this.baseUrl}/v1/auth/verify-email?token=${token}`;
    return this.http.get(url, this.httpOptions);

    // future scope integration for if we send token in body
    //   const httpOptionsnew = {
    //   headers: new HttpHeaders({
    //     'Authorization': `Bearer ${token}`
    //   })
    // };
    // const url = `${this.baseUrl}/v1/auth/verify-email/`;
    // return this.http.get(url, httpOptionsnew);
  }

  /** Forget password */
  forgotPasswordRequest(email: string): Observable<ForgotPasswordResponse> {
    const url = `${this.baseUrl}/v1/users/request-password-reset/`;
    const payload: ForgotPasswordRequest = { email };
    return this.http.post<ForgotPasswordResponse>(
      url,
      payload,
      this.httpOptions,
    );
  }

  /** login */
  login(email: string, password: string): Observable<any> {
    // payload for login request format
    // {
    //   email: string,
    //   password: string,
    //   device: {
    //     deviceId: string,
    //     platform: string,
    //     deviceName: string,
    //     osVersion: string
    //   },
    //   location: {
    //     ip: string,
    //     country: string,
    //     timezone: string,
    //     latitude: number,
    //     longitude: number
    //   }
    // }

    // reponse for login request format
    /**{
     * code: 200,
     * message: 'Login successful',
     * data: {accessToken: string,tokenType: string,expiresIn: number, userId: string, email: string, userName: string},
     * meta: {}
     * requestId: string,
     *  timestamp: string
     * }
     */

    // mock response for testing
    // return of({
    //   code: 200,
    //   message: 'Login successful',
    //   data: {
    //     accessToken: 'vhgfhfgfytfuyguyyfututyughgbbjhhbbhjgyutderethbcsrxrcvmbvtrecvvm7s4wtyfuyktru64rvytkvcyjtrkgfn',
    //     tokenType: 'Bearer',
    //     expiresIn: 3600,
    //     userId: '1',
    //     email: 'ZxTt9@example.com',
    //     userName: 'John Doe',
    //   },
    //   meta: {},
    //   requestId: 'req-12345',
    //   timestamp: new Date().toISOString(),
    // }).pipe(delay(10));

    const url = `${this.baseUrl}/v1/auth/login/`;

    // Get device and location info
    return forkJoin({
      deviceInfo: this.deviceSession.getDeviceInfo(),
      locationInfo: this.deviceSession.getLocationInfo(),
    }).pipe(
      switchMap(({ deviceInfo, locationInfo }) => {
        const payload: LoginRequest = {
          email,
          password,
          device: deviceInfo,
          location: locationInfo,
        };
        console.log('login payload', payload);

        return this.http.post<any>(url, payload, this.httpOptions);
      }),
    );
  }

  /** registration */
  register(formData: any): Observable<any> {
    // payload for register request format
    //  RegisterRequest {
    //   firstName: string;
    //   lastName: string;
    //   email: string;
    //   phoneNumber: string;
    //   userType: UserType;
    //   accountType: AccountType;
    //   password: string;
    //   password2: string;
    // }

    /**
     * code: 201,
     * message: 'Registration successful. Activation email sent.',
     * data: {massage: string,verificationToken: string,expiresInSeconds: number, email: string, createdAt: string, date_joined: string},
     * meta: {},
     * requestId: string,
     * timestamp: string
     */
    console.log('formData', formData);

    const url = `${this.baseUrl}/v1/accounts/register/`;
    return this.http.post<any>(url, formData, this.httpOptions).pipe(
      tap((response) => {
        const token = response?.data?.verificationToken;
        const expiresIn = response?.data?.expiresInSeconds;
        if (token) {
          this.setVerificationToken(token, expiresIn);
        }
      }),
    );
  }

  // Add this method for resending activation link
  resendActivationLink(
    email: string,
    verificationToken?: string | null,
  ): Observable<ActivationResponse> {
    // Use provided token, or fallback to stored registration token
    const token = verificationToken ?? this.getVerificationToken();

    const url = `${this.baseUrl}/v1/accounts/resend-activation/`;

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }),
    };

    return this.http.post<ActivationResponse>(
      url,
      { email },
      httpOptionsWithAuth,
    );
  }
}

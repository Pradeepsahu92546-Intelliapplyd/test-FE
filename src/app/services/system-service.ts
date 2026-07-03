import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
 

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  constructor(private http: HttpClient) {}
    get baseUrl(): string {
      return environment.apiUrl;
    }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // Get system list
  getSystemList(): Observable<any> {
    // mock response
    const mockSystemList = {
      count: 0,
      systemlist: [],
    };

    return of({
      code: 200,
      message: 'System list fetched successfully',
      data: mockSystemList,
      meta: {},  
      requestId: 'redomid-12345',
        timestamp: new Date().toISOString(),  
    }).pipe(delay(10));

    // return this.http.get(this.baseUrl + 'system', this.httpOptions);
  }
}

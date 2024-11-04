import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  user = new BehaviorSubject<User | null>(null);
  private expirationTimer: any;
  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAs46NgqwBtw24Qy-afdGnyRlax7CNBN1Q", {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
    }));
  }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAs46NgqwBtw24Qy-afdGnyRlax7CNBN1Q", {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
    }));
  }

  autoLogin() {
    let userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: Date
    };
    const tmpData = localStorage.getItem('userData');
    if (!tmpData) return;
    userData = JSON.parse(tmpData);
    const loadedData = new User(userData.email, userData.id, userData._token, userData._tokenExpirationDate)
    if (!!loadedData.token) {
      this.user.next(loadedData);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  getUsers(): Observable<any> {
    const reqData: any = {};
    this.user.subscribe((user: User | null) => {
      if (user && user.token) {
        reqData['idToken'] = user.token;
      }
    });
    return this.http.post<any>("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAs46NgqwBtw24Qy-afdGnyRlax7CNBN1Q", reqData)
    .pipe(catchError(this.handleError));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
    this.expirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.expirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An unknown error occured!";
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => errorMessage);
    }
    switch(errorRes.error.error.message) {
      case "EMAIL_EXIST":
        errorMessage = "This email exists already!";
        break;
      case "EMAIL_NOT_FOUND":
        errorMessage = "This email does not exist!";
        break;
      case "INVALID_PASSWORD":
        errorMessage = "This password is not correct!";
        break;
    }

    return throwError(() => errorMessage);
  }
}
          
          
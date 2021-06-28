import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStrogeService } from './local-storage.service';
import { UserService } from './user.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { pipe } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class TokenInterceptorService {
    

     refreshingInProgress: boolean = false;
     accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    
  
    constructor(
      private _userService: UserService,
      private _router: Router,
      private _localStorageService: LocalStrogeService,
    ) { }
  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
      const accessToken = this._localStorageService.getAccessToken();
      req = this.addAccessTokenHeader(req, accessToken);
      return next.handle(req)
      .pipe(
        catchError(err => {
  
          if( err instanceof HttpErrorResponse && err.status == 401 ) {
  
            const refreshToken = this._localStorageService.getRefreshToken();
            
            if( accessToken && refreshToken ) {
              return this.refreshToken(req, next);
            } else{
              return throwError(err);
            }
  
          } else if( err instanceof HttpErrorResponse && err.status == 403 ) {
  
            return this.logoutAndRedirect(err);
  
          } else {
  
            return throwError(err);
            
          }
  
        })
      )
    }
    
    addAccessTokenHeader(req: HttpRequest<any>, accessToken: string| null) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return req;
    }
  
    logoutAndRedirect(err: HttpErrorResponse) {
      this._userService.logoutUser();
      this._router.navigate(['/login']);
      return throwError(err)
    }
  
    refreshToken(req: HttpRequest<any>, next: HttpHandler):  Observable<HttpEvent<any>> {
      if( !this.refreshingInProgress ) {
  
        this.refreshingInProgress = true;
        this.accessTokenSubject.next(null);
  
        return this._userService.refreshToken()
        .pipe(
          switchMap(tokens => {
            this.refreshingInProgress = false;
            this.accessTokenSubject.next(tokens.accessToken);
            req = this.addAccessTokenHeader(req, tokens.accessToken);
            return next.handle(req)
          })
        )
  
      } else {
  
        
        return this.accessTokenSubject.pipe(
          filter(token => token != null),
          take(1),
          switchMap(token => {
            req = this.addAccessTokenHeader(req, token);
            return next.handle(req)
          })
        )
  
      }
    }
    
  }
  
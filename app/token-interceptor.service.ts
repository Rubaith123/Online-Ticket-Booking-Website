import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { UserService } from './user.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class TokenInterceptorService {
  
    
  
    constructor(
      private _userService: UserService,
      private _router: Router,
      private _localStorageService: LocalStorageService,
    ) { }
  
    intercept(req: HttpRequest<any>, next: HttpHandler):
     Observable<HttpEvent<any>> {
  
      const accessToken = this._localStorageService.getAccessToken();
      req = this.addAccessTokenHeader(req, accessToken);
      return next.handle(req);
     }
     addAccessTokenHeader(req: HttpRequest<any>, accessToken: string | null) {
        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
        });
        return req;
      }
    }


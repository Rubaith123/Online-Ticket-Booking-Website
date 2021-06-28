import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LocalStrogeService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  User$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(

    private _http: HttpClient,
    private _localStorageService: LocalStrogeService,
   
  ) { }

  registerUser(user:{name: string, email: string, password: string}): Observable<any>{
      return this._http.post(`${environment.API_URL}/users/register`, user)
      .pipe(
        tap((res: any) => {
          this._localStorageService.setTokens(res.accessToken, res.refreshToken);
          this.User$.next(res.user);
        })
      );
  }
     

  loginUser( user: {email: string, password: string}): Observable<any> {
    return this._http.post<any>(`${environment.API_URL}/users/login`, user)
    .pipe(
        tap((res: any) => {
        this._localStorageService.setTokens(res.accessToken, res.refreshToken);
        this.User$.next(res.user);
      }),
      
    )
  }

  logoutUser() {
    this._localStorageService.clearTokens();
    this.User$.next(null);
  }

  getFavouriteBlogs(){
    return this._http.get(`${environment.API_URL}/user/favourites`)
  }

  fetchUserData(): Observable<any> {
    return this._http.get<any>(`${environment.API_URL}/user/me`)
    .pipe(
        tap((user: any) => {
        const makeUser = {
          id: user._id,
          name: user.name,
          email: user.email
        };
        this.User$.next(makeUser);
      })
    );
  }
  
  getLoggedInUserData(): Observable<any> {
    return this.User$
    .pipe(
      switchMap(user => {
        if( user ) {
          return of(user);
        }
          return of(null);
        })
      );
  }

  refreshToken(): Observable<{accessToken: string, refreshToken: string}> {
    const refreshToken = this._localStorageService.getRefreshToken();
    return this._http.post<{accessToken: string, refreshToken: string}>(`${environment.API_URL}/user/me/refresToken`, {refreshToken})
    .pipe(
      tap(tokens => {
        console.log('Token refreshed!');
        this._localStorageService.setTokens(tokens.accessToken, tokens.refreshToken)
        })
      );
    }
  }

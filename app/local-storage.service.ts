import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'

})
export class LocalStrogeService{
    constructor(){}
    setToken(accessToken: string, refreshToken: string){
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    getAccessToken(){
        return localStorage.getItem('accesstoken');

    }
    getRefreshToken(){
        return localStorage.getItem('refreshtoken');
}
clearToken(){
    localStorage.clear();
}
}
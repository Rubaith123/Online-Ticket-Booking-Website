import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'

})
export class LocalStrogeService{

    constructor(){}

    setTokens(accessToken: string, refreshToken: string){
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    getAccessToken(){
        return localStorage.getItem('accessToken');

    }

    getRefreshToken(){
        return localStorage.getItem('refreshToken');
    }

    clearTokens(){
        localStorage.clear();
    }
}
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription} from 'rxjs';
import {UserService} from '../services/user.service';
@Component({
    selector:'/app-register',
    templateUrl:'./register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

    user={
        name:'',
        email:'',
        password:''
    }
    userSub: Subscription | undefined;
    error: string='';

    constructor(
        private _userService: UserService,
        private _router: Router 
    ){}
    
    ngOnInit(): void{
    }

    ngOnDestroy(): void{
    }

    register() {

        this.error= '';
        
        if( !this.user.name || !this.user.email || !this.user.password) {
            this.error= 'naem, email and password must not be empty';
        } else{
            this.userSub= this._userService.registerUser(this.user)
            .subscribe(res=> {
                console.log('User registered!');
                this._router.navigate(['/ticket-list']);
                this.userSub?.unsubscribe();
              }, err => {
                this.error = err.error.message;
                this.userSub?.unsubscribe();
            })
        }

    }

}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {UserService} from '../services/user.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   user= {
     email: '',
     password:''
   }
   userSub: Subscription | undefined;
   error: string ='';
   
  constructor(
    private _userService: UserService,
    private _router: Router 
  ) { }

  ngOnInit(): void {
  }
  login(){
    this.error= '';

    if(!this.user.email || !this.user.password) {
      this.error = 'email & password must not be empty';
   } else

   this.userSub = this._userService.loginUser(this.user)
   .subscribe(res => {

     console.log('user loggedin|');
     this._router.navigate(['/ticket-list']);
     
   }, err => {
     
     console.log(err);
     this.error= err.error.message;

   })
  }

}

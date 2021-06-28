import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private _userService: UserService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this._userService.logoutUser();
    this._router.navigate(['/login']);
  }

}

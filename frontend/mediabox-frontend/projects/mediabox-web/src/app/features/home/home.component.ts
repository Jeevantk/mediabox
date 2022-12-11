import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isAuth: boolean = false;
  constructor(private authService:AuthService) { }

  async ngOnInit(): Promise<void> {
    const authData =  await this.authService.checkAuth()
    this.isAuth = authData.isAuth
  }

}

import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { AuthService } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  showSignoutBtn = false;

  constructor(private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    const authDetails = await this.authService.checkAuth();
    this.showSignoutBtn = authDetails.isAuth;
  }

  signOut() {
    Auth.signOut();
  }

}

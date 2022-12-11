import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import Auth from '@aws-amplify/auth';
import { Hub } from 'aws-amplify';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private router: Router,
    private zone: NgZone
  ) {
    Hub.listen('auth', (data: { payload: { event: any; }; }) => {
      switch (data.payload.event) {
        case 'signIn':
          this.zone.run(() => {
            this.router.navigate(['files'])
          });
          break;
        case 'signOut':
          this.removeAuth();
          this.router.navigate(['']);
          break;
      }
    });
  }

  public loggedIn = false;
  private token: string | null = '';
  private authStatusListener = new Subject<{
    session: any;
    isAuth: boolean;
    idToken: string | null;
  }>();
  private isAuthenticated = false;
  private sessionDetails: any;
  private userName: string | null = '';

  getUserName() {
    return this.sessionDetails.signInUserSession.idToken.payload[
      'custom:uniqueName'
    ];
  }

  getUserId() {
    try {
      return this.sessionDetails.signInUserSession.idToken.payload[
        'custom:userId'
      ];
    } catch (error) {
      return '';
    }
  }

  getSessionDetails() {
    return this.sessionDetails;
  }

  getIdToken() {
    return this.token;
  }

  isAuth() {
    return this.isAuthenticated;
  }

  checkIfAuthorizedUser(userId: string) {
    const loggedInUserId = this.getUserId();
    return userId === loggedInUserId;
  }

  async checkAuth() {
    try {
      const session = await Auth.currentAuthenticatedUser();
      this.userName = session.username;
      this.isAuthenticated = true;
      this.sessionDetails = session;
      this.token = this.sessionDetails.signInUserSession.idToken.jwtToken;
      this.authStatusListener.next({
        session: this.sessionDetails,
        isAuth: this.isAuthenticated,
        idToken: this.token,
      });
      return {
        session: this.sessionDetails,
        isAuth: this.isAuthenticated,
        idToken: this.token,
      };
    } catch (error) {
      this.userName = null;
      this.isAuthenticated = false;
      this.sessionDetails = null;
      this.token = null;
      this.authStatusListener.next({
        session: this.sessionDetails,
        isAuth: this.isAuthenticated,
        idToken: this.token,
      });
      return {
        session: null,
        isAuth: false,
        idToken: null,
      };
    }
  }

  removeAuth() {
    this.isAuthenticated = false;
    this.sessionDetails = null;
    this.authStatusListener.next({
      session: this.sessionDetails,
      isAuth: this.isAuthenticated,
      idToken: this.token,
    });
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
}

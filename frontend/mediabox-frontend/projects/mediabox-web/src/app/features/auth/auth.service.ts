import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Hub, ICredentials } from '@aws-amplify/core';
import Auth, {
  CognitoHostedUIIdentityProvider,
  CognitoUser,
} from '@aws-amplify/auth';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private router: Router,
    private zone: NgZone
  ) {
  }
  public static SIGN_IN = 'signIn';
  public static SIGN_OUT = 'signOut';
  public static GOOGLE = CognitoHostedUIIdentityProvider.Google;
  private headerRefresh = new Subject<boolean>();

  public loggedIn = false;

  private _authState: Subject<CognitoUser | any> = new Subject<
    CognitoUser | any
  >();
  authState: Observable<CognitoUser | any> = this._authState.asObservable();

  private token: string | null = '';
  private authStatusListener = new Subject<{
    session: any;
    isAuth: boolean;
    idToken: string | null;
  }>();
  private isAuthenticated = false;
  private sessionDetails: any;
  private userName: string | null = '';
  onHeaderRefresh() {
    this.headerRefresh.next(true);
  }
  getHeaderRefreshListener() {
    return this.headerRefresh.asObservable();
  }

  socialSignIn(
    provider: CognitoHostedUIIdentityProvider
  ): Promise<ICredentials> {
    return Auth.federatedSignIn({
      provider,
    });
  }

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

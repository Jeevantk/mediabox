import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { AuthService } from './auth.service';
  import { from, Observable } from 'rxjs';
  import { switchMap } from 'rxjs/operators';
  import { Router } from '@angular/router';
  
  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router: Router) {}
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      return from(this.getIdToken()).pipe(
        switchMap((idToken) => {
          let modifiedReq;
          if (
            !request.url.includes('mediabox-files')
          ) {
            const authToken = idToken || '';
            modifiedReq = request.clone({
              headers: request.headers.set('Authorization', authToken),
            });
          } else {
            modifiedReq = request.clone();
            console.log("modifiedReq", modifiedReq)
          }
          return next.handle(modifiedReq);
        })
      );
    }
  
    async getIdToken() {
      const authDetails = await this.authService.checkAuth();
      if (authDetails.isAuth) {
        return this.authService.getIdToken();
      }
      return '';
    }
  }
  
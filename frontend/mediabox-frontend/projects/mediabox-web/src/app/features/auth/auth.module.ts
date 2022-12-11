import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticatorComponent } from './authenticator/authenticator.component';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';


@NgModule({
  declarations: [
    AuthenticatorComponent
  ],
  imports: [
    CommonModule,
    AmplifyAuthenticatorModule
  ],
  exports: [
    AuthenticatorComponent
  ]
})
export class AuthModule { }

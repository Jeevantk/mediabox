import { Component, OnInit } from '@angular/core';
import { AuthenticatorMachineOptions } from '@aws-amplify/ui';
@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss']
})
export class AuthenticatorComponent implements OnInit {

  formFields!:AuthenticatorMachineOptions['formFields'];

  constructor() { }

  ngOnInit(): void {
    this.formFields = {
      'signIn': {
        username: {
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email address',
          required: true,
        },
        password: {
          type: 'password',
          label: 'Password',
          placeholder: 'Enter your password',
          required: true,
        }
      },
      signUp: {
        username: {
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email address',
          required: true,
        },
        password: {
          type: 'password',
          label: 'Password',
          placeholder: 'Enter your password',
          required: true,
        }
      }
    }
  }
}

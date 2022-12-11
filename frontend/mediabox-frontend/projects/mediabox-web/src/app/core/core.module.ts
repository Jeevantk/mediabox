import { Auth } from 'aws-amplify';
import awsconfig from '../../aws-exports';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';

Auth.configure(awsconfig);


@NgModule({
  declarations: [
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule
  ],
  exports: [
    MainLayoutComponent
  ]
})
export class CoreModule { }

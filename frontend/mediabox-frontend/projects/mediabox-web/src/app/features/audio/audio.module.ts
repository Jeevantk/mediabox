import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioListComponent } from './audio-list/audio-list.component';
import { AudioRoutingModule } from './audio-routing.module';
import { AudioUploadComponent } from './audio-upload/audio-upload.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AudioListComponent,
    AudioUploadComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule,
    MatInputModule,
    MatSnackBarModule,
    HttpClientModule,
    AudioRoutingModule
  ],
  exports: [
    AudioListComponent
  ]
})
export class AudioModule { }

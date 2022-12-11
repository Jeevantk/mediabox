import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioListComponent } from './audio-list/audio-list.component';
import { AudioUploadComponent } from './audio-upload/audio-upload.component';

const routes: Routes = [
    { 
        path: 'upload', 
        component: AudioUploadComponent,
        pathMatch: 'full'
    },
    { 
        path: '', 
        component: AudioListComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AudioRoutingModule { }

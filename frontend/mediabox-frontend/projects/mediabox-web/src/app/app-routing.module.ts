import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'files',
    loadChildren: () =>
      import('./features/audio/audio.module').then((m) => m.AudioModule),
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
    import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

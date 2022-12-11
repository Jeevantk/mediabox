import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './features/auth/auth-guard';

const routes: Routes = [
  {
    path: 'files',
    loadChildren: () =>
      import('./features/audio/audio.module').then((m) => m.AudioModule),
      canActivate:[AuthGuard]
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
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }

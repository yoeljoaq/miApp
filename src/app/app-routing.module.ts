import { NgModule } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/compat/auth-guard';

const redireccionarlogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: 'home',canActivate:[AngularFireAuthGuard],data:{authGuardPipe:redireccionarlogin},
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'login',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'agregarvehiculo',
    redirectTo: 'agregarvehiculo',
    pathMatch: 'full'
  },
  {
    path: 'vervehiculo',
    redirectTo: 'vervehiculo',
    pathMatch: 'full'
  },
  {
    path: 'signup',
    redirectTo: 'signup',
    pathMatch: 'full'
  },
  {
    path: 'reset-password',
    redirectTo: 'reset-password',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    redirectTo: 'landing',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'e404',
    pathMatch: 'full'
  },



  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'e404',
    loadChildren: () => import('./pages/e404/e404.module').then( m => m.E404PageModule)
  },
  {
    path: 'agregarvehiculo',canActivate:[AngularFireAuthGuard],data:{authGuardPipe:redireccionarlogin},
    loadChildren: () => import('./pages/agregarvehiculo/agregarvehiculo.module').then( m => m.AgregarvehiculoPageModule)
  },
  {
    path: 'vervehiculo',canActivate:[AngularFireAuthGuard],data:{authGuardPipe:redireccionarlogin},
    loadChildren: () => import('./pages/vervehiculo/vervehiculo.module').then( m => m.VervehiculoPageModule)
  },



  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


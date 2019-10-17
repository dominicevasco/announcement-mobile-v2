import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BroadcastPage } from './broadcast/broadcast.page';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'registration', loadChildren: './registration/registration.module#RegistrationPageModule' },
  { path: 'post-ae/:state/:id', loadChildren: './post-ae/post-ae.module#PostAePageModule' },
  { path: 'broadcast-ae/:state/:id', loadChildren: './broadcast-ae/broadcast-ae.module#BroadcastAePageModule' },
  { path: 'broadcast/:id', loadChildren: './broadcast/broadcast.module#BroadcastPageModule' },
  { path: 'broadcast-post/:id', loadChildren: './broadcast-post/broadcast-post.module#BroadcastPostPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

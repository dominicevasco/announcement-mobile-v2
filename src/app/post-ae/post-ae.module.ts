import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Camera } from '@ionic-native/Camera/ngx';
import { PostAePage } from './post-ae.page';

const routes: Routes = [
  {
    path: '',
    component: PostAePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ], providers: [
    Camera,
  ],
  declarations: [PostAePage]
})
export class PostAePageModule { }

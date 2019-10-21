import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BroadcastBookmarkPage } from './broadcast-bookmark.page';

const routes: Routes = [
  {
    path: '',
    component: BroadcastBookmarkPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BroadcastBookmarkPage]
})
export class BroadcastBookmarkPageModule {}

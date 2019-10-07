import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BroadcastPage } from './broadcast.page';

const routes: Routes = [
  {
    path: '',
    component: BroadcastPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [BroadcastPage],
  declarations: [BroadcastPage],
  exports: [BroadcastPage]
})
export class BroadcastPageModule { }
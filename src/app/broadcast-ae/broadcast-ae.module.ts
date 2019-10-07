import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BroadcastAePage } from './broadcast-ae.page';

const routes: Routes = [
  {
    path: '',
    component: BroadcastAePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BroadcastAePage]
})
export class BroadcastAePageModule {}

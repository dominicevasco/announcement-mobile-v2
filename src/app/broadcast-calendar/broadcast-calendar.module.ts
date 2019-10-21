import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BroadcastCalendarPage } from './broadcast-calendar.page';
import { NgCalendarModule } from 'ionic2-calendar';

const routes: Routes = [
  {
    path: '',
    component: BroadcastCalendarPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgCalendarModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BroadcastCalendarPage]
})
export class BroadcastCalendarPageModule {}

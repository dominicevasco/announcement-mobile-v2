import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      { path: 'post', loadChildren: '../post/post.module#PostPageModule' },
      { path: 'people', loadChildren: '../people/people.module#PeoplePageModule' },
      { path: 'notification', loadChildren: '../notification/notification.module#NotificationPageModule' },
      { path: 'broadcast-calendar', loadChildren: '../broadcast-calendar/broadcast-calendar.module#BroadcastCalendarPageModule' },
      { path: '', pathMatch: 'full', redirectTo: 'post' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomePage]
})
export class HomePageModule { }

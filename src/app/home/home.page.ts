import { Component, OnInit } from '@angular/core';
import SessionStoreService from 'src/services/session.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  isAdmin: boolean = false;

  notificationNumber: number;

  constructor(private sessionStorage: SessionStoreService,
    private loader: LoadingController,
    private router: Router, private apiService: ApiService) {

    this.sessionStorage.getUserData().then(data => {
      this.isAdmin = data.accessType === 'ADMIN';
    })
  }

  async logout() {
    const l = await this.loader.create({
      message: 'Please wait...'
    });
    l.present();

    setTimeout(() => {
      this.sessionStorage.removeSession().then(() => {
        l.dismiss();
        this.router.navigateByUrl("login");
      })
    }, 2000);
  }

  ngOnInit() {
    this.loadNotificationNumber();
  }

  loadNotificationNumber() {
    //select all posts which status is pending.
    this.apiService.doGet("/post/all/pending", {}).then(data => {
      const posts: [] = JSON.parse(data.data);
      this.notificationNumber = posts.length;
    });
  }

}

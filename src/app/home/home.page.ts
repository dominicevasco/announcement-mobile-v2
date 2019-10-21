import { Component, OnInit } from '@angular/core';
import SessionStoreService from 'src/services/session.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import LoadingService from 'src/services/loadingService';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  isAdmin: boolean = false;

  notificationNumber: number;

  constructor(private sessionStorage: SessionStoreService,
    private loaderService : LoadingService,
    private router: Router, private apiService: ApiService) {

    this.sessionStorage.getUserData().then(data => {
      this.isAdmin = data.accessType === 'ADMIN';
    })
  }

  async logout() {
    await this.loaderService.display('Logging out...');
    this.router.navigateByUrl("login");
    this.loaderService.dismiss();
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

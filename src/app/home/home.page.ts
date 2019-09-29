import { Component, OnInit } from '@angular/core';
import SessionStoreService from 'src/services/session.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private sessionStorage: SessionStoreService, 
    private loader: LoadingController,
    private router: Router) { }

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
    
  }

}

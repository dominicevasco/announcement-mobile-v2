import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import Utils from 'src/services/message.util';
import DefaultAccountService from 'src/services/_login/default.service';
import SessionStoreService from 'src/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string;
  password: string;

  constructor(private router: Router,
    private actionSheet: ActionSheetController,
    private loader: LoadingController,
    private defaultLogin: DefaultAccountService,
    private util: Utils,
    private sessionStorage: SessionStoreService) { }

  /**
   * Method to display registration options.
   * 
   */
  async signUp() {
    const action = await this.actionSheet.create({
      header: 'Membership options',
      buttons: [
        {
          text: 'System default',
          icon: 'contact',
          handler: () => {
            this.router.navigateByUrl("registration")
          }
        }, {
          text: 'Facebook',
          icon: 'logo-facebook',
          handler: () => {

          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    action.present();
  }

  /**
   * Method to login using email and password.
   * 
   */
  login = async () => {
    const l = await this.loader.create({
      message: 'Please wait...'
    });
    l.present()
    setTimeout(() => {
      this.defaultLogin.signIn(this.username, this.password).then(() => {
        this.router.navigateByUrl("home");
      })
      l.dismiss();
    }, 1000);
  }

  ngOnInit() {
    this.sessionStorage.removeSession();
  }

  /**
   * Method to send password reset link to your email.
   */
  forgotPassword = async () => {
    const l = await this.loader.create({
      message: 'Sending password reset link...'
    });
    l.present();

    setTimeout(() => {
      this.defaultLogin.forgotPassword(this.username).then(() => {
        this.util.showToastMessage('Password reset link has been sent to your email', 'warning');
        l.dismiss();
      });
      l.dismiss();
    }, 2000);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import DefaultAccountService from 'src/services/_login/default.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string;
  password: string;

  constructor(private router: Router, private actionSheet: ActionSheetController, private defaultLogin: DefaultAccountService) { }

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
  login = () => {
    this.defaultLogin.signIn(this.username, this.password).then(() => {
      this.router.navigateByUrl("home");
    })
  }

  ngOnInit() { }

}

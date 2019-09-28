import { Component, OnInit } from '@angular/core';
import DefaultAccountService from 'src/services/_login/default.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  private username;
  private password;
  private cpassword;

  constructor(private defaultAccountService: DefaultAccountService, private router: Router) { }

  register = () => {
    this.defaultAccountService.signUp(this.username, this.password, 'system').then(() => {
      this.router.navigateByUrl("");
    });
  }

  ngOnInit() { }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { User } from 'src/model/user';
import Utils from 'src/services/message.util';
import DefaultAccountService from 'src/services/_login/default.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {


  image: any = null;
  base64Image: any = null;

  username;
  password;
  cpassword;

  lastname;
  firstname;
  middlename;

  constructor(private defaultAccountService: DefaultAccountService,
    private camera: Camera,
    private router: Router, private util: Utils) { }

  browseImage() {
    this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY)
  }

  pickImage(sourceType): any {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      this.base64Image = imageData;
    }, (err) => {
      this.util.showToastMessage('Error : ' + err.error);
    });
  }

  register = () => {
    const user = new User();

    user.username = this.username;
    user.password = this.password;
    user.fname = this.firstname;
    user.mname = this.middlename;
    user.lname = this.lastname;
    user.photo = this.base64Image;
    user.email = this.username;

    if (this.password === this.cpassword) {
      this.defaultAccountService.signUp(user, 'system').then(() => {
        this.router.navigateByUrl("");
      });
    } else {
      this.util.showToastMessage('Password dont match!');
    }
  }

  ngOnInit() { }

}

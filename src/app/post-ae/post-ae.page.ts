import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { Post } from 'src/model/post';
import { ApiService } from 'src/services/api.service';
import Utils from 'src/services/message.util';
import SessionStoreService from 'src/services/session.service';

@Component({
  selector: 'app-post-ae',
  templateUrl: './post-ae.page.html',
  styleUrls: ['./post-ae.page.scss'],
})
export class PostAePage implements OnInit {

  id: any;
  title: string;
  isPublic: boolean = true;

  authorId: any;
  postDate: any;
  fullname: any;
  profileImage: any;

  toggleImage: any = null;
  base64Image: any = null;
  message: any = null;

  constructor(private router: ActivatedRoute,
    private routerLink: Router,
    private sessionService: SessionStoreService,
    private loader: LoadingController,
    private actionSheet: ActionSheetController,
    private camera: Camera,
    private util: Utils,
    private apiService: ApiService) { }

  ngOnInit() {
    this.router.paramMap.subscribe(params => {
      const state = params.get('state');
      if (state === 'add') {
        this.title = 'Create Announcement'
        this.postDate = new Date().toLocaleString();
      } else {
        this.id = params.get('id');
        this.title = 'Modify Announcement'
      }
    })

    this.sessionService.getUserData().then(data => {
      this.authorId = data.id;
      this.fullname = data.fullname;
      this.profileImage = data.photo;
    })
  }

  /**
   * Method to select image
   */
  async selectImage() {
    const selector = await this.actionSheet.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    selector.present();
  }

  /**
   * method to select video
   */
  selectVideo() {

  }

  /**
   * Method to get the image from the selected
   * source type.
   * 
   * @param sourceType 
   */
  pickImage(sourceType): any {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      this.toggleImage = 'data:image/jpeg;base64,' + imageData;
      this.base64Image = imageData;
    }, (err) => {
      this.util.showToastMessage('Error : ' + err.error);
    });
  }

  /**
   * Submit announcement
   */
  async submit() {
    const postLoad = await this.loader.create({
      message: 'Please wait..'
    });
    postLoad.present();

    setTimeout(() => {
      let post = new Post();
      post.id = this.id;
      post.content = this.message;
      post.fileData = this.base64Image;
      post.author = this.authorId;

      this.apiService.doPost('/post/add', post).then(data => {
        postLoad.dismiss();

        this.util.showToastMessage('Post has been successfully submitted!', 'success');
        this.routerLink.navigateByUrl("/home/post");
      }, err => {
        this.util.showToastMessage('Error : ' + err.error);
      })
    }, 1000);
  }
}

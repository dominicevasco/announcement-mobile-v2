import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Post } from 'src/model/post';
import { ApiService } from 'src/services/api.service';
import Utils from 'src/services/message.util';
import ImagePostService from 'src/services/post/imagePostService';
import SessionStoreService from 'src/services/session.service';
import VideoPostService from 'src/services/post/videoPostService';

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

  base64: any = null;
  message: any = null;
  type: any = null;

  constructor(private router: ActivatedRoute,
    private routerLink: Router,
    private sessionService: SessionStoreService,
    private loader: LoadingController,
    private util: Utils,
    private apiService: ApiService,
    private imagePostService: ImagePostService,
    private videoPostService: VideoPostService) { }

  /**
   * Page on load.
   */
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
  selectImage() {
    this.imagePostService.selectImage().then(imageData => {
      this.type = 'IMAGE';
      this.toggleImage = 'data:image/jpeg;base64,' + imageData;
      this.base64 = imageData;
    }, err => {
      this.util.showToastMessage('Error : ' + err.error);
    })
  }

  /**
   * method to select video
   */
  selectVideo() {
    this.videoPostService.selectVideo().then(videoData => {
      this.type = 'VIDEO';
      this.base64 = videoData;
    }, err => {
      this.util.showToastMessage('Error : ' + err);
    })
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
      //validate first
      if (null !== this.message || null !== this.base64) {
        let post = new Post();
        post.id = this.id;
        post.content = this.message;
        post.fileData = this.base64;
        post.author = this.authorId;
        post.type = this.type;

        this.apiService.doPost('/post/add', post).then(data => {
          this.util.showToastMessage('Post has been successfully submitted!', 'success');
          this.routerLink.navigateByUrl("/home/post");
        }, err => {
          this.util.showToastMessage('Error : ' + err.error);
        }).finally(() => {
          postLoad.dismiss();
        })
      } else {
        this.util.showToastMessage('Please enter content before submitting..');
      }
    }, 1000);
  }
}

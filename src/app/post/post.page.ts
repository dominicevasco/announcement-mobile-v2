import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Post } from 'src/model/post';
import { ApiService } from 'src/services/api.service';
import Utils from 'src/services/message.util';
import { Router } from '@angular/router';
import SessionStoreService from 'src/services/session.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  profile: any;
  name: any;
  posts: any = []

  constructor(private loadingController: LoadingController,
    private apiService: ApiService, private util: Utils,
    private router: Router, private sessionStorage: SessionStoreService) { }

  ngOnInit() {
    this.sessionStorage.getUserData().then(data => {
      this.profile = data.photo;
    })
    this.loadAnnouncement();
  }

  /**
   * Method to display write post
   */
  writePost = () => {
    this.router.navigate(['post-ae/', 'add', -1])
  }
  /**
   * Method to display posts
   */
  loadAnnouncement = async () => {
    const loader = await this.loadingController.create({
      message: 'Please wait...'
    });
    loader.present();

    setTimeout(() => {
      //call post from the backend
      this.apiService.doGet('/post/all', {}).then((data) => {
        //split because array in string format
        const splitArr: [] = JSON.parse(data.data);
        this.posts = [];

        splitArr.forEach((item: any, index) => {
          let post = new Post();
          post.id = item.id;
          post.content = item.message;
          post.dateAdded = item.dateAdded;
          post.fileData = 'data:image/jpeg;base64,' + item.file64;
          post.author = item.user['lastname'] + "," + item.user['firstname']
          post.authorPic = 'data:image/jpeg;base64,' + item.user['profile'];

          this.posts.push(post);
        }, error => {
          this.util.showToastMessage(error.error, 'danger', 3000);
        })
      }).finally(() => {
        loader.dismiss();
      });
    }, 1000);


  }

}

import { Component, OnInit } from '@angular/core';
import { Post } from 'src/model/post';
import { ApiService } from 'src/services/api.service';
import SessionStoreService from 'src/services/session.service';
import { LoadingController } from '@ionic/angular';
import Utils from 'src/services/message.util';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  isAdmin: boolean = false;

  posts: any = []

  constructor(private apiService: ApiService,
    private sessionStorage: SessionStoreService,
    private loader: LoadingController,
    private util: Utils) {
  }

  ngOnInit() {
    this.viewPostRequest();
  }


  /**
   * Notification for announcement request.
   * 
   */
  async viewPostRequest() {
    let sql;
    const tLoader = await this.loader.create({
      message: 'Please wait...'
    })
    tLoader.present();

    this.sessionStorage.getUserData().then(data => {
      this.isAdmin = data.accessType === 'ADMIN';
      if (this.isAdmin) {
        sql = '/post/all/pending';
      } else {
        //view post only this user.
        sql = '/post/user/' + data.id;
      }
    });
    setTimeout(() => {
      this.apiService.doGet(sql, {}).then(data => {
        const postArr: [] = JSON.parse(data.data);
        this.posts = [];
        postArr.forEach((item: any, index) => {
          let post = new Post();
          post.id = item.id;
          post.content = item.message.substring(0, 15) + '...';
          post.dateAdded = item.dateAdded;
          post.status = item.status;
          post.fileData = 'data:image/jpeg;base64,' + item.file64;
          post.author = item.user['lastname'] + "," + item.user['firstname']
          post.authorPic = 'data:image/jpeg;base64,' + item.user['profile'];

          this.posts.push(post);
        })
      });

      tLoader.dismiss();
    }, 300);
  }

  /**
   * Method to accept the post
   */
  async doActionPost(id,action) {
    console.log('post id ' + id);
    const tload = await this.loader.create({
      message: 'Processing...'
    });
    tload.present();

    setTimeout(() => {
      this.apiService.doPost('/post/respond', {
        'id': id,
        'status': action
      }).then(data => {
        tload.dismiss();
        this.util.showToastMessage('Transaction complete','success');
      }, err => {
        this.util.showToastMessage('Error ' + err.error);
      }).finally(() => {
        this.viewPostRequest();
      })
    }, 300);
  }
}

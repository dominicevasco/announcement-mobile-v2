import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, IonContent } from '@ionic/angular';
import { Post } from 'src/model/post';
import { ApiService } from 'src/services/api.service';
import Utils from 'src/services/message.util';
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

  pageNumber: any = 0;

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  constructor(private loadingController: LoadingController,
    private apiService: ApiService, private util: Utils,
    private router: Router, private sessionStorage: SessionStoreService) { }

  /**
   * If scroll down reached the end.
   * 
   * @param event 
   */
  loadData(event) {
    setTimeout(() => {
      const totalData = this.loadAnnouncement(false);
      event.target.complete();
      console.log('returned data ' + totalData);
    }, 2000);
  }

  /**
   * On page load
   */
  async ngOnInit() {
    const loader = await this.loadingController.create({
      message: 'Please wait...'
    });

    loader.present();

    setTimeout(() => {
      this.sessionStorage.getUserData().then(data => {
        this.profile = 'data:image/jpeg;base64,' + data.photo;
        console.log(this.profile);
      })
      this.loadAnnouncement();
      loader.dismiss();
    }, 2000);
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
  loadAnnouncement = (isNewSetData: boolean = true): number => {
    if (isNewSetData) this.pageNumber = 0;//reset page number
    //call post from the backend
    this.apiService.doGet(`/post/all/approved/${this.pageNumber}`, {}).then((data) => {
      //split because array in string format
      const splitArr: [] = JSON.parse(data.data);

      if (isNewSetData) this.posts = [];

      console.log('Total records retrieved : ' + splitArr.length);

      splitArr.forEach((item: any, index) => {
        let post = new Post();
        post.id = item.id;
        post.content = item.message;
        post.dateAdded = item.dateAdded;

        post.author = item.user['lastname'] + "," + item.user['firstname']
        post.authorPic = 'data:image/jpeg;base64,' + item.user['profile'];

        if ('null' !== item.file64) {
          post.fileData = 'data:image/jpeg;base64,' + item.file64;
        }

        this.posts.push(post);
      });

      //increment page number
      this.pageNumber += 1;
      console.log('Page number ' + this.pageNumber);

      return splitArr.length;
    }, error => {
      this.util.showToastMessage(error.error, 'danger', 3000);
    })

    return 0;
  }


  /**
   * On clicking the refresh button UI
   */
  refreshAnnouncment() {
    this.content.scrollToTop(1000).then(async () => {
      const loader = await this.loadingController.create({
        message: 'Please wait...'
      });

      loader.present();
      setTimeout(() => {

        this.loadAnnouncement();
        loader.dismiss();
      }, 1000);

      console.log('status ' + this.infiniteScroll.disabled);
      this.infiniteScroll.disabled = false;
    });

  }

}

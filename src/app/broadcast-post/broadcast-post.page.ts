import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { Post } from 'src/model/post';
import Utils from 'src/services/message.util';
import { LoadingController, IonReorderGroup, ModalController } from '@ionic/angular';
import SessionStoreService from 'src/services/session.service';
import { BroadcastBookmarkPage } from '../broadcast-bookmark/broadcast-bookmark.page';
import LoadingService from 'src/services/loadingService';

@Component({
  selector: 'app-broadcast-post',
  templateUrl: './broadcast-post.page.html',
  styleUrls: ['./broadcast-post.page.scss'],
})
export class BroadcastPostPage implements OnInit {

  @ViewChild(IonReorderGroup, { static: false }) reorderGroup: IonReorderGroup;

  posts: any = []
  id;

  orderOfId: any = [];

  constructor(private routerMap: ActivatedRoute, private api: ApiService, private util: Utils,
    private router: Router, private loadingService: LoadingService) { }

  ngOnInit() {
    this.routerMap.paramMap.subscribe(parms => {
      this.id = parms.get("id");
    })
    this.loadContent();
  }

  doReorder(ev: any) {
    console.log('order ' + this.orderOfId);

    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    const itemMove = this.orderOfId.splice(ev.detail.from, 1)[0];
    this.orderOfId.splice(ev.detail.to, 0, itemMove);
    ev.detail.complete();


    console.log('order ' + this.orderOfId);
  }

  async updateOrder() {
    await this.loadingService.display('Please wait...', '1')

    try {
      const data = await this.api.doPost(`/broadcast/reorder/${this.id}`, {
        orderPost: this.orderOfId.join()
      })
      if (data.status === 200) {
        this.util.showToastMessage('Announcement has been reordered!', 'success');
      }
    } catch (err) {
      this.util.showToastMessage('Error : ' + err.error);
    }


    this.loadingService.dismiss('1');
  }

  async loadContent() {
    await this.loadingService.display('Checking announcement...', '1');

    this.api.doPost(`/broadcast/posts/${this.id}`, {}).then(data => {
      const splitArr: [] = JSON.parse(data.data);
      this.posts = [];
      splitArr.forEach((item: any, index) => {
        let post = new Post();
        post.id = item.id;
        post.content = item.message;
        post.dateAdded = item.dateAdded;

        post.author = item.user['lastname'] + "," + item.user['firstname']
        post.authorPic = this.util.validateProfilePic(item.user['profile']);

        post.type = item.type;

        this.posts.push(post);
        this.orderOfId.push(post.id);
      })

      this.loadingService.dismiss('1');
    })
  }

  async addPost() {
    this.router.navigate(['broadcast-bookmark', this.id])
  }
}

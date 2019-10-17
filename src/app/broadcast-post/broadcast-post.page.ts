import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { Post } from 'src/model/post';
import Utils from 'src/services/message.util';
import { LoadingController, IonReorderGroup } from '@ionic/angular';

@Component({
  selector: 'app-broadcast-post',
  templateUrl: './broadcast-post.page.html',
  styleUrls: ['./broadcast-post.page.scss'],
})
export class BroadcastPostPage implements OnInit {

  @ViewChild(IonReorderGroup, { static: false }) reorderGroup: IonReorderGroup;

  posts: any = []
  id;

  constructor(private routerMap: ActivatedRoute, private api: ApiService, private util: Utils,
    private loader: LoadingController) { }

  ngOnInit() {
    this.routerMap.paramMap.subscribe(parms => {
      this.id = parms.get("id");
    })
    this.loadContent();
  }

  doReorder(ev: any) {
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
  }

  async loadContent() {
    const l = await this.loader.create({
      message: 'Please wait...'
    })
    l.present();

    setTimeout(() => {
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
        })

        l.dismiss();
      })
    }, 2000);
  }
}

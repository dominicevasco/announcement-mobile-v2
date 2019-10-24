import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import SessionStoreService from 'src/services/session.service';
import LoadingService from 'src/services/loadingService';
import { ApiService } from 'src/services/api.service';
import { Post } from 'src/model/post';
import Utils from 'src/services/message.util';

@Component({
  selector: 'app-broadcast-bookmark',
  templateUrl: './broadcast-bookmark.page.html',
  styleUrls: ['./broadcast-bookmark.page.scss'],
})
export class BroadcastBookmarkPage implements OnInit {

  broadcastId;

  loggedUserId;

  bookmarks: any = [];

  constructor(private router: ActivatedRoute,
    private navRouter : Router,
    private sessionStorage: SessionStoreService,
    private loaderService: LoadingService,
    private apiService: ApiService,
    private util: Utils) {

    this.router.paramMap.subscribe(params => {
      this.broadcastId = params.get("id");
    })
  }

  async ngOnInit() {
    const sessionUser = await this.sessionStorage.getUserData();
    this.loggedUserId = sessionUser.id;

    await this.loadBookmark();
  }

  /**
   * Method to load bookmark from this user.
   */
  async loadBookmark() {
    await this.loaderService.display('Retrieving Bookmarks...')

    const bookmarkResponse = await this.apiService.doGet(`/bookmark/all/${this.loggedUserId}`)
    const bookmarksArray: [] = JSON.parse(bookmarkResponse.data);

    this.bookmarks = [];

    bookmarksArray.forEach((item: any) => {
      let post = new Post();

      post.id = item.id;
      post.content = item.message;
      post.dateAdded = item.dateAdded;
      post.author = item.user['lastname'] + "," + item.user['firstname']
      post.authorPic = this.util.validateProfilePic(item.user['profile']);
      post.type = item.type;
      post.bookmarked = false;

      this.bookmarks.push(post);
    })

    this.loaderService.dismiss();
  }

  /**
   * Save to be displayed in organize broadcast.
   * 
   */
  async saveToBroadcast() {
    const selectedBookmarksId = [];
    this.bookmarks.forEach(element => {
      if (element.bookmarked) {
        selectedBookmarksId.push(element.id);
      }
    });

    if (selectedBookmarksId.length > 0) {
      await this.loaderService.display('Processing...');
      try {
        const response = await this.apiService.doPost(`/broadcast/add/${this.broadcastId}`, {
          bookmarksId: selectedBookmarksId.join()
        })

        if (response.status === 200) {
          this.util.showToastMessage('Bookmarked item has been added!', 'success');
        }
      } catch (error) {
        this.util.showToastMessage('Error : ' + error.error);
      }
      this.loaderService.dismiss();
      this.navRouter.navigateByUrl("home/broadcast-calendar");
    } else {
      this.util.showToastMessage('No item has been selected!')
    }

  }
}

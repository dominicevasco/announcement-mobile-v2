import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { AbstractAnnouncementView } from 'src/services/post/abstractViewPostService';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage extends AbstractAnnouncementView
  implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  /**
   * On page load
   */
  async ngOnInit() {
    this.sessionStorage.getUserData().then(data => {
      this.profile = this.util.validateProfilePic(data.photo);
      this.loggedUserId = data.id;
      this.name = data.name;
      this.isAdmin = data.accessType === 'ADMIN';
    })
    await this.loadAnnouncement();
  }

  /**
   * Method to display write post
   */
  writePost = () => {
    this.router.navigate(['post-ae/', 'add', -1])
  }


  /**
   * On clicking the refresh button UI
   */
  refreshAnnouncment() {
    this.content.scrollToTop(1000).then(async () => {
      setTimeout(async () => {
        this.loadAnnouncement();
      }, 500);
      this.infiniteScroll.disabled = false;
    });
  }

  /**
   * To view user profile.
   * 
   * @param id 
   */
  viewProfile(id) {
    this.router.navigate(['profile', id]);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractAnnouncementView } from 'src/services/post/abstractViewPostService';
import { IonInfiniteScroll, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage
  extends AbstractAnnouncementView
  implements OnInit {

  authorId;
  image = null;
  fullname;

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  ngOnInit() {
    this.routerMap.paramMap.subscribe(params => {
      this.authorId = params.get("id");
      this.sessionStorage.getUserData().then(data => {
        this.loggedUserId = data.id;
        this.isAdmin = data.accessType === 'ADMIN';
        this.loadAuthorProfile();
        this.loadAnnouncement(true,this.authorId)
      })
    })
  }

  async loadAuthorProfile() {
    const authorDetailData = await this.apiService.doGet(`/user/find/${this.authorId}`)
    const authorDetail = JSON.parse(authorDetailData.data);
    this.fullname = authorDetail.lastname + ',' + authorDetail.firstname
    this.image = this.util.validateProfilePic(authorDetail.profile);
    console.log('profile');
  }

  refreshAnnouncment() {
    this.content.scrollToTop(1000).then(async () => {
      setTimeout(async () => {
        this.loadAnnouncement();
      }, 500);
      this.infiniteScroll.disabled = false;
    });
  }


}

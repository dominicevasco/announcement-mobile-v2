import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { Post } from 'src/model/post';
import { ApiService } from '../api.service';
import LoadingService from '../loadingService';
import Utils from '../message.util';
import SessionStoreService from '../session.service';

export abstract class AbstractAnnouncementView {

    profile: any;
    name: any;
    posts: any = []

    pageNumber: any = 0;

    loggedUserId;

    isAdmin: boolean = false;

    constructor(protected loadingController: LoadingController,
        protected routerMap: ActivatedRoute,
        protected apiService: ApiService,
        protected util: Utils,
        protected router: Router,
        protected sessionStorage: SessionStoreService,
        protected actionSheet: ActionSheetController,
        protected confirm: AlertController,
        protected loadingService: LoadingService) {
    }

    /**
   * Method to display posts
   */
    async loadAnnouncement(isNewSetData: boolean = true,defaultAuthorId = -1) {

        if (isNewSetData) {
            await this.loadingService.display('Pulling records...', '1');
            this.pageNumber = 0;
            this.posts = [];
        }

        console.log('User id : ' + this.loggedUserId);

        try {
            const data = await this.apiService.doGet(`/post/all/approved/${this.pageNumber}/${this.loggedUserId}/${defaultAuthorId}`);
            const contentArray: [] = JSON.parse(data.data);

            contentArray.forEach((item: any) => {
                let post = new Post();
                post.id = item.id;
                post.content = item.message;
                post.dateAdded = item.dateAdded;
                post.authorId = item.user['id'];
                post.author = item.user['lastname'] + "," + item.user['firstname']
                post.authorPic = this.util.validateProfilePic(item.user['profile']);
                post.type = item.type;
                post.bookmarked = item.isBookMarked;

                if ('null' !== item.file64) {
                    if (item.type === 'IMAGE') {
                        post.fileData = 'data:image/jpeg;base64,' + item.file64;
                    } else if (item.type === 'VIDEO') {
                        post.fileData = 'data:video/mp4;base64,' + item.file64;
                    }
                }

                this.posts.push(post);
            });

            this.pageNumber += 1;
        } catch (error) {
            this.util.showToastMessage(error.error, 'danger', 3000);
        }

        if (isNewSetData) {
            this.loadingService.dismiss("1");
        }
    }

    /**
   * More action for this post.
   * 
   * @param id 
   */
    async moreAction(id, isBookMarked) {
        const actionButton: any = [
            {
                text: (isBookMarked ? 'Un-Bookmarked' : 'Bookmark'),
                icon: 'bookmark',
                handler: () => {
                    if (isBookMarked) {
                        this.removeBookMark(id);
                    } else {
                        this.addBookmark(id);
                    }
                }
            }, {
                text: 'Delete',
                icon: 'trash',
                role: 'destructive',
                handler: () => {
                    this.removePost(id);
                }
            }, {
                text: 'Cancel',
                role: 'cancel'
            }
        ];

        const actions = await this.actionSheet.create({
            header: 'Options',
            buttons: actionButton
        });
        actions.present();
    }

    /**
   * Add post to bookmark
   * @param id 
   */
    async addBookmark(id) {
        await this.loadingService.display('Adding Bookmark...', '1');

        const userData = await this.sessionStorage.getUserData();
        const data = await this.apiService.doPost(`/bookmark/mark`, {
            userId: userData.id,
            postId: id
        })

        if (data.status === 200) {
            this.util.showToastMessage('Post has been bookmarked!', 'success');
        }

        this.loadingService.dismiss('1');
        this.refreshAnnouncment();
    }

    /**
   * Remove post to bookmark
   */
    async removeBookMark(id) {
        await this.loadingService.display('Removing Bookmark...', '1');

        const userData = await this.sessionStorage.getUserData();
        const data = await this.apiService.doDelete(`/bookmark/remove/${id}/${userData.id}`)

        if (data.status === 200) {
            this.util.showToastMessage('Post has been un-marked!', 'success');
        }

        this.loadingService.dismiss('1');
        this.refreshAnnouncment();
    }

    /**
   * If scroll down reached the end.
   * 
   * @param event 
   */
    async loadData(event) {
        await this.loadAnnouncement(false);
        event.target.complete();
    }

    /**
   * Remove post
   * @param id 
   */
    async removePost(id) {
        const alert = await this.confirm.create({
            message: 'Are you sure to remove this?',
            subHeader: 'This action cannot be undone!',
            buttons: [{
                text: 'Delete',
                role: 'destructive',
                handler: async () => {
                    this.loadingService.display('Removing...').then(async () => {
                        await this.apiService.doDelete(`/post/delete/${id}`, {}).then(data => {
                            this.util.showToastMessage('Announcement has been deleted!', 'warning');
                        })
                        this.loadingService.dismiss();
                        this.loadAnnouncement();
                    })
                }
            }, {
                text: 'Cancel',
                role: 'cancel'
            }]
        });

        await alert.present();
    }
    abstract refreshAnnouncment();
}
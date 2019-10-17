import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { Broadcast } from 'src/model/broadcast';
import { LoadingController, ActionSheetController } from '@ionic/angular';
import Utils from 'src/services/message.util';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.page.html',
  styleUrls: ['./broadcast.page.scss'],
})
export class BroadcastPage implements OnInit {

  pageNumber: any = 0;
  broadcasts: any = [];

  postId: any = null;

  selectedBroadcast = [];

  constructor(private router: Router,
    private activateRoute: ActivatedRoute,
    private actionController: ActionSheetController,
    private apiService: ApiService,
    private util: Utils,
    private loader: LoadingController) { }

  ngOnInit() {
    this.loadList();

    this.activateRoute.paramMap.subscribe(parms => {
      this.postId = parms.get('id');
    })
  }

  view(id) {
    this.router.navigate(['broadcast-post', id]);
  }

  addCheckedToList(event, bid) {
    if (event.target.checked) {
      this.selectedBroadcast.push(bid);
    }
  }

  async addBroadcastPost() {
    const l = await this.loader.create({
      message: 'Please wait...'
    });
    l.present();

    setTimeout(() => {
      this.apiService.doPost(`/broadcast/add/${this.postId}`, { 'broadcasts': this.selectedBroadcast.join("+") }).then(data => {
        this.util.showToastMessage('Post has been added into the selected broadcast(s)', 'success');
        this.router.navigateByUrl("/home");
      }, err => {
        this.util.showToastMessage(err.error);
      });
      l.dismiss();
    }, 1000);
  }

  async moreAction(id) {
    console.log('Broadcast id : ' + id);
    const action = await this.actionController.create({
      header: 'Please select',
      buttons: [
        {
          text: 'Re-schedule',
          handler: () => {

          }
        }, {
          text: 'Announcement Re-order',
          handler: () => {

          }
        },

        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    })

    action.present();
  }

  async loadList() {
    const l = await this.loader.create({
      message: 'Please wait...'
    });
    l.present();

    setTimeout(() => {
      this.apiService.doGet(`/broadcast/all/${this.pageNumber}`, {}).then(data => {
        const content = JSON.parse(data.data);
        const jsonData = content.content;

        this.broadcasts = [];

        jsonData.forEach((item: any, index) => {
          const broadcast = new Broadcast();

          broadcast.id = item.id;
          broadcast.note = item.note;
          broadcast.expDate = item.expirationDate.replace('T', ' ');
          broadcast.startDate = item.startDate.replace('T', ' ');

          this.broadcasts.push(broadcast);

        })
        l.dismiss();
      })
    }, 1000);
  }

  addBroadcast() {
    this.router.navigate(['broadcast-ae', 'add', -1]);
  }

}

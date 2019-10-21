import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import Utils from 'src/services/message.util';
import LoadingService from 'src/services/loadingService';

@Component({
  selector: 'app-broadcast-calendar',
  templateUrl: './broadcast-calendar.page.html',
  styleUrls: ['./broadcast-calendar.page.scss'],
})
export class BroadcastCalendarPage implements OnInit {

  eventSource: any = [];

  calendar = {
    mode: 'month',
    currentDate: new Date()
  }

  dateTitle;

  constructor(private apiService: ApiService,
    private actionContrl: ActionSheetController,
    private router: Router,
    private loader: LoadingController,
    private alertControl: AlertController,
    private util: Utils,
    private loadingService: LoadingService) { }

  onViewTitleChanged(title) {
    this.dateTitle = title;
  }

  async onEventSelected(event) {
    const eventId = event.id;

    console.log(event);

    let commandButtons = [];

    if (!event.isPlayed) {
      commandButtons = [{
        text: 'Modify',
        handler: () => { this.router.navigate(['broadcast-ae', 'edit', eventId]) }
      }, {
        text: 'Organize',
        handler: () => { this.router.navigate(['broadcast-post', eventId]); }
      }, {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.removeBroadcast(eventId);
        }
      }]
    } else {
      commandButtons = [{
        text: 'View',
        handler: () => {

        }
      }]
    }

    commandButtons.push({
      text: 'Cancel',
      role: 'cancel'
    })

    const actionCntroller = await this.actionContrl.create({
      header: 'Menu',
      buttons: commandButtons
    });

    actionCntroller.present();
  }

  /**
   * Delete event/broadcast.
   * 
   * @param id 
   */
  async removeBroadcast(id) {
    const alert = await this.alertControl.create({
      message: 'Are you sure to delete this?',
      subHeader: 'This action cannot be undone',
      buttons: [{
        text: 'Delete',
        handler: (async () => {
          const loadingDelete = await this.loader.create({
            message: 'Please wait...'
          });
          loadingDelete.present();
          setTimeout(() => {
            this.apiService.doDelete(`/broadcast/remove/${id}`, {}).then(data => {
              this.util.showToastMessage('Broadcast topic has been deleted!', 'success');
              loadingDelete.dismiss();
              this.loadBroadcastEvent();
            })
          }, 1000);
        })
      }, { text: 'Cancel', role: 'cancel' }]
    });
    await alert.present();
  }

  /**
   * Method to change view
   */
  async changeView() {
    // this.calendar.mode = event.detail.value;
    const viewCntrl = await this.actionContrl.create({
      header: 'View Options',
      buttons: [{
        text: 'Monthly',
        role: 'destructive',
        handler: () => {
          this.calendar.mode = 'month'
          this.loadBroadcastEvent();
        }
      }, {
        text: 'Weekly',
        handler: () => {
          this.calendar.mode = 'week'
          this.loadBroadcastEvent();
        }
      }, {
        text: 'Daily',
        handler: () => {
          this.calendar.mode = 'day'
          this.loadBroadcastEvent();
        }
      }, { text: 'Cancel', role: 'cancel' }]
    });
    await viewCntrl.present();
  }

  /**
   * Add new broadcast
   */
  addBroadcast() {
    this.router.navigate(['broadcast-ae', 'add', -1]);
  }

  ngOnInit() {
    this.loadBroadcastEvent();
  }

  /**
   * Load all broadcast
   */
  async loadBroadcastEvent() {
    await this.loadingService.display('Please wait...', '1');

    const data = await this.apiService.doGet(`/broadcast/all`, {});
    const jsonData = JSON.parse(data.data);
    this.eventSource = []
    jsonData.forEach((item: any) => {
      this.eventSource.push({
        id: item.id,
        title: item.note,
        startTime: new Date(item.startDate),
        endTime: new Date(item.expirationDate),
        allDay: item.allDay,
        isPlayed: item.isPlayed
      });
    })

    this.loadingService.dismiss('1');
  }

}

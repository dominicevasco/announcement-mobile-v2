import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { Broadcast } from 'src/model/broadcast';
import { LoadingController } from '@ionic/angular';
import Utils from 'src/services/message.util';
import LoadingService from 'src/services/loadingService';

@Component({
  selector: 'app-broadcast-ae',
  templateUrl: './broadcast-ae.page.html',
  styleUrls: ['./broadcast-ae.page.scss'],
})
export class BroadcastAePage implements OnInit {

  id: any;

  sDate;
  sTime;

  eDate;
  eTime;

  interval;

  note: any;

  buttonCaption: string;

  isChecked;

  today = new Date();
  dateTill;

  constructor(private router: ActivatedRoute,
    private util: Utils,
    private nav: Router, private apiService: ApiService, private loadingService: LoadingService) { }

  /**
   * Initial load of the page depending on the status.
   * 
   */
  ngOnInit() {
    this.today.setDate(this.today.getDate());
    this.dateTill = this.today.toISOString().substr(0, 10);

    this.router.paramMap.subscribe(p => {
      const state = p.get('state');
      if (state === 'add') {
        this.buttonCaption = 'Save'
      } else {
        this.buttonCaption = 'Update'
        this.loadDataForEdit(p.get('id'));
      }
    })
  }

  /**
   * Load data if edit
   */
  async loadDataForEdit(id) {
    await this.loadingService.display('Please wait...')
    this.apiService.doGet(`/broadcast/find/${id}`).then(response => {
      const data = JSON.parse(response.data);

      this.id = data.id;
      this.note = data.note;
      this.interval = data.duration;
      this.isChecked = data.allDay;
      this.sDate = this.formatDateTime(data.startDate, 0);
      this.sTime = this.formatDateTime(data.startDate, 1);

      this.eDate = this.formatDateTime(data.expirationDate, 0);
      this.eTime = this.formatDateTime(data.expirationDate, 1);

      this.loadingService.dismiss();
    })
  }

  async validate() {
    const isIntervalValid = this.interval > 5 && this.interval <= 15;
    console.log(isIntervalValid);
    if(isIntervalValid){
      return Promise.resolve();
    }else{
      return Promise.reject('Invalid duration.')
    }
  }

  /**
   * Submitt
   */
  async submit() {
    await this.loadingService.display('Please wait...')

    //validate
    this.validate().then(async () => {
      console.log('Validation passed!');

      const broadcast = new Broadcast();
      let message: string = 'Broadcast topic created!';

      broadcast.allDay = this.isChecked;
      broadcast.startDate = this.formatDateTime(this.sDate, 0) + ' ' + this.formatDateTime(this.sTime, 1)
      broadcast.expDate = this.formatDateTime(this.eDate, 0) + ' ' + this.formatDateTime(this.eTime, 1)
      broadcast.note = this.note;
      broadcast.interval = this.interval;

      if (this.isChecked) {
        this.sTime = this.formatDateTime(this.sDate, 1);
        this.eTime = this.formatDateTime(this.eDate, 1);
      }

      if (this.buttonCaption === 'Update') {
        broadcast.id = this.id;
        message = 'Broadcast topic has been updated!';
      }

      await this.saveOrUpdate(broadcast, message).then(() => {
        this.loadingService.dismiss();
      })
    }, err => {
      this.util.showToastMessage('Error : ' + err);
      this.loadingService.dismiss();
    })

  }

  private async saveOrUpdate(broadcast: Broadcast, message) {
    try {
      const apiSave = await this.apiService.doPost('/broadcast/set', broadcast);
      if (apiSave.status === 200) {
        this.util.showToastMessage(message, 'success');
        this.nav.navigateByUrl('/home/broadcast-calendar');
      }
    } catch (err) {
      this.util.showToastMessage('Error : ' + err.error);
    }
  }

  /**
   * format Date Time
   * @param val 
   * @param index 
   */
  formatDateTime(val, index) {
    const result: any[] = val.split('T');

    if (result.length > 1) {
      return result[index];
    }

    return result[0];
  }
}

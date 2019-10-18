import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { Broadcast } from 'src/model/broadcast';
import { LoadingController } from '@ionic/angular';
import Utils from 'src/services/message.util';

@Component({
  selector: 'app-broadcast-ae',
  templateUrl: './broadcast-ae.page.html',
  styleUrls: ['./broadcast-ae.page.scss'],
})
export class BroadcastAePage implements OnInit {

  id: any;

  sDate;

  eDate;

  interval;

  note;

  constructor(private router: ActivatedRoute,
    private util: Utils,
    private nav: Router, private apiService: ApiService, private loader: LoadingController) { }

  /**
   * 
   */
  ngOnInit() {
    this.router.paramMap.subscribe(p => {
      const state = p.get('state');
      if (state === 'add') {
        this.id = p.get('id');
      }
    })

    console.log('id ' + this.id);
  }


  /**
   * Submitt
   */
  async submit() {
    const l = await this.loader.create({
      message: 'Please wait...'
    });
    l.present();
    setTimeout(() => {
      const broadcast = new Broadcast();

      broadcast.startDate = this.sDate
      broadcast.expDate = this.eDate
      broadcast.note = this.note;
      broadcast.interval = this.interval;

      this.apiService.doPost('/broadcast/create', broadcast).then(data => {
        if (data.status === 200) {
          this.util.showToastMessage('Broadcast topic created!', 'success');
          this.nav.navigateByUrl('/home/broadcast/display');
        }
      }, err => {
        this.util.showToastMessage('Error : ' + err.error);
      });
      l.dismiss();
    }, 1000);
  }
}

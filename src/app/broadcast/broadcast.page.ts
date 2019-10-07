import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { Broadcast } from 'src/model/broadcast';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.page.html',
  styleUrls: ['./broadcast.page.scss'],
})
export class BroadcastPage implements OnInit {

  pageNumber: any = 0;
  broadcasts: any = [];

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.apiService.doGet(`/broadcast/all/${this.pageNumber}`, {}).then(data => {
      const content = JSON.parse(data.data);
      const jsonData = content.content;

      this.broadcasts = [];

      jsonData.forEach((item: any, index) => {
        const broadcast = new Broadcast();

        broadcast.id = item.id;
        broadcast.note = item.note;
        broadcast.expDate = item.expirationDate;
        broadcast.startDate = item.startDate;

        this.broadcasts.push(broadcast);

      })
    })
  }

  addBroadcast() {
    this.router.navigate(['broadcast-ae', 'add', -1]);
  }

}

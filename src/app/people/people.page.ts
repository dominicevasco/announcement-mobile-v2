import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import Utils from 'src/services/message.util';
import SessionStoreService from 'src/services/session.service';
import { User } from 'src/model/user';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  users: any = []
  type: string = 'APPROVED';

  isSearch: boolean = false;
  isAdd: boolean = false;

  userEmail: string;

  //check from session
  isAdmin: boolean = true;
  isChangeRoleButtonDisplay: boolean = true;
  isInactiveButtonDisplay: boolean = true;

  constructor(private loader: LoadingController,
    private apiService: ApiService,
    private util: Utils,
    private alert: AlertController,
    public modalController: ModalController,
    private actionSheet: ActionSheetController,
    private sessionStorage: SessionStoreService) {

    this.sessionStorage.getUserData().then(data => {      
      this.isAdmin = data.accessType === 'ADMIN';
    })

  }

  /**
   * Method that loads the user based on status.
   * 
   * @param typeParam 
   */
  async loadUser(typeParam) {

    const reload = await this.loader.create({
      message: 'Updating...'
    });
    reload.present();

    setTimeout(async () => {
      const userList = await this.apiService.doGet('/user/all/' + typeParam, {})
        .catch(async err => {
          this.util.showToastMessage(err.error, 'danger')
        });

      const userListData = JSON.parse(userList.data);
      if (userListData !== null && userListData !== undefined) {
        this.users = [];
        userListData.forEach(item => {
          let itemClone = item;
          console.log('profile : ' + item.profile);
          itemClone.profile = this.util.validateProfilePic(item.profile);

          this.users.push(itemClone);
        })
      }

      reload.dismiss();

    }, 500);
  }

  /**
   * Method to change the role of the user.
   * 
   * @param id 
   * @param role 
   */
  async changeRole(id, role: string = 'USER') {
    const confirm = await this.alert.create({
      header: 'Warning',
      subHeader: 'You are about to change the role of this selected user!',
      message: 'Proceed in changing the role for this user?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            console.log('selected user id : ' + id);
            this.apiService.doPost('/user/change/' + role, {
              id: id
            }).then(async data => {
              if (data.status == 202) {
                this.util.showToastMessage('Role has been successfully changed to ' + role.toUpperCase(), 'success')
                this.loadUser(this.type)
              }
            }, err => {
              this.util.showToastMessage('Error : ' + err.error)
            })
          }
        }, { text: 'Cancel', role: 'cancel' }
      ]

    });
    confirm.present();
  }

  /**
   * Method that change the user's status to inactive
   * @param id 
   */
  async changeUserStatus(id, status: string = 'APPROVED') {
    const confirm = await this.alert.create({
      header: 'Warning',
      subHeader: 'Change status to ' + (status != 'APPROVED' ? 'inactive' : 'active'),
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            console.log('selected user id for chage status ' + id);
            this.apiService.doPost('/user/change', {
              id: id,
              status: status
            }).then(async data => {
              if (data.status == 202) {
                this.util.showToastMessage('User status has been changed!', 'warning');
                this.loadUser(this.type);
              }
            }, err => {
              this.util.showToastMessage('Error ' + err.error)
            })
          }
        }, { text: 'Cancel', role: 'cancel' }
      ]

    });
    confirm.present();
  }

  /**
   * Method for searching
   * @param event 
   */
  async startSearch(event: CustomEvent) {
    const value: string = event.detail.value;
    if (value.length > 0) {
      this.users = [];
      this.isSearch = true;
    } else {
      this.isSearch = false;
      this.loadUser(this.type);
    }
  }

  /**
   * Method to pull record based on the segment.
   * 
   * @param ev 
   */
  segmentChanged(ev: CustomEvent) {
    this.type = ev.detail.value;
    this.users = [];//clean the list

    this.isAdd = this.type === 'PENDING'

    //hide inactive button or trash button if tab is declined
    this.isInactiveButtonDisplay = this.type !== 'DECLINED'

    this.loadUser(this.type);
  }

  /**
   * Add user via sending an email invitation
   */
  async addUserPending() {
    console.log('Sending email for invitation');
    const action = await this.actionSheet.create({
      header: 'Registration Options',
      buttons: [
        {
          text: 'Email and Password',
          icon: 'mail',
          handler: () => {
            //save account using system as registration type
            this._addEmailUnRegistered('system');
          }
        }, {
          text: 'Facebook',
          icon: 'logo-facebook',
          handler: () => {
            this._addEmailUnRegistered('facebook');
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    })

    action.present();
  }

  /**
   * Save new email account in the database.
   * 
   * @param type 
   */
  private _addEmailUnRegistered(type: string) {
    this.apiService.doPost('/user/add', {
      'email': this.userEmail,
      'type': type
    }).then(() => {
      this.util.showToastMessage('User added', 'success')
    }, error => {
      this.util.showToastMessage('Error ' + error.error);
    }).finally(() => {
      this.loadUser(this.type);
    })
  }

  /**
   * Delete unverified
   */
  async removeUnverified(id) {
    console.log('removed id ' + id);
    const alert = await this.alert.create({
      header: 'Remove unvefied account',
      message: "Are you sure to remove this account?",
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            const load = await this.loader.create({
              message: "Removing please wait.."
            });
            load.present();
            setTimeout(() => {
              this.apiService.doPost('/user/remove/' + id, {}).then(() => {
                load.dismiss();
                this.util.showToastMessage('User removed sucessfully', 'warning');
                this.loadUser(this.type);
              }, err => {
                this.util.showToastMessage('Error : ' + err.error);
              })
            }, 200);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }
  
  ngOnInit() { this.loadUser(this.type); }

}

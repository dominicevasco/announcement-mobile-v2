import { AngularFireAuth } from "@angular/fire/auth";
import { LoadingController, ToastController } from '@ionic/angular';
import { Status } from 'src/model/status';
import { User } from 'src/model/user';
import { ApiService } from '../api.service';
import Utils from '../message.util';
import SessionStoreService from '../session.service';

export abstract class LoginAbstract {

    constructor(protected afuth: AngularFireAuth,
        protected toast: ToastController,
        protected loader: LoadingController,
        protected apiService: ApiService,
        protected sessionStore: SessionStoreService,
        protected util: Utils) { }

    /**
     * Sign in method
     */
    async signIn(username, password, type = 'system'): Promise<any> {
        const result = new Promise(async (resolve, reject) => {
            //login via firebase
            this.login(username, password).then(res => {
                //validate for user access and retrieve credentials
                this.apiService.doPost('/user/find', {
                    'email': username
                }).then((data) => {
                    //store session
                    let pData = JSON.parse(data.data);
                    if (pData.status === 'APPROVED') {
                        this.sessionStore.storeUserData(pData).then(() => {
                            let x = this.sessionStore.getUserData();
                            console.log(x);
                            resolve();
                        }, err => {
                            reject(err);
                        });
                    } else {
                        this.util.showToastMessage('Not allowed to access the system');
                    }
                }, err => {
                    console.log(err);
                    this.util.showToastMessage(err.error);
                    reject(err)
                })
            }, err => {
                console.log(err);
                this.util.showToastMessage(err.message);
            })
        })
        return result;
    }


    /**
     * Method to register a new user.
     * 
     * @param username 
     * @param password 
     */
    async signUp(user: User, type): Promise<any> {
        const username = user.username;
        const password = user.password;

        const result = new Promise(async (resolve, reject) => {
            const load = await this.loader.create({
                message: 'Please wait...'
            });
            load.present();
            setTimeout(() => {
                //validate first if email is already saved in our database
                this.apiService.doPost('/user/validate', {
                    'email': username,
                    'type': type
                }).then(data => {
                    if (data.status === 202) {
                        //save to db
                        this.saveAccountCopy(user, type).then(status => {
                            //save to firebase,
                            this.register(username, password).then(res => {
                                resolve();
                            }, err => {
                                this.util.showToastMessage(err.message);
                            })
                        }, err => {
                            console.log(err);
                            this.util.showToastMessage(err.error);
                        })

                    }
                }, err => {
                    console.log(err);
                    this.util.showToastMessage(err.error);
                    reject(err);
                })
                load.dismiss();
            }, 2000);
        })

        return result;
    }

    abstract register(username, password): Promise<User>
    abstract login(username, password): Promise<any>


    /**
     * Since firebase handles the authentication.
     * We save the user details in our own database.
     * 
     * @param data 
     */
    private async saveAccountCopy(user: User, type = 'system'): Promise<Status> {
        const status = new Status();
        const savePromise = new Promise<Status>((resolve, reject) => {
            this.apiService.doPost('/user/register/' + type, user).then((data) => {
                status.code = data.status;
                status.message = 'Registration Successfull';
                resolve(status)
            }, error => {
                status.code = error.code;
                status.message = error.error;
                reject(status);
            })
        });

        return savePromise;
    }
}
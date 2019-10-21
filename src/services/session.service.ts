import { Injectable } from "@angular/core";
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
    providedIn: 'root'
})

export default class SessionStoreService {
    static USER_DATA = 'USER_DATA';

    constructor(private session: NativeStorage) { }

    private checkAccess(type) {
        if (null === type || undefined === type) {
            return 'USER'
        }

        return type;
    }

    /**
     * Method to store user data in the cache.
     * 
     * @param user 
     */
    storeUserData(user): Promise<any> {
        const userPromise = new Promise((resolve, reject) => {
            this.session.clear();//clear all saved login credentials first
            this.session.setItem(SessionStoreService.USER_DATA,
                {
                    'id': user.id,
                    'fullname': user.lastname + ',' + user.firstname + ' ' + user.middlename,
                    'name': user.lastname + ',' + user.firstname,
                    'email': user.email,
                    'photo': user.profile,
                    'accessType': this.checkAccess(user.userType)
                }
            ).then(() => {
                resolve()
            }, err => {
                reject()
            });
        })

        return userPromise;
    }


    async removeSession() {
        await this.session.remove(SessionStoreService.USER_DATA);
        await this.session.clear();
    }

    /**
     * to retrieve infor
     */
    getUserData(): Promise<any> {
        const p = new Promise((resolve, reject) => {
            this.session.getItem(SessionStoreService.USER_DATA).then(data => {
                console.log('User data : ' + data);
                resolve(data);
            })
        })

        return p;
    }
}
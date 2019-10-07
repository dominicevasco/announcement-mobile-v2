import { Injectable } from "@angular/core";
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

export default class Utils {

    constructor(private toast: ToastController,
        private loader: LoadingController) { }

    /**
     * To display toast message.
     * 
     */
    showToastMessage = async (message, color = 'danger', duration = 3000) => {
        const t = await this.toast.create({
            message: message,
            duration: duration,
            color: color
        });
        t.present();
    }

    /**
     * To display default profile if no profile picture
     */
    validateProfilePic(pic: any): string {
        if (null === pic || undefined === pic) {
            return '../assets/profile.svg';
        }

        return 'data:image/jpeg;base64,' + pic;
    }
}
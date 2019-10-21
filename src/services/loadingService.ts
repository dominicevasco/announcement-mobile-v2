import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export default class LoadingService {

    constructor(private loadingController: LoadingController) {

    }

    async display(message: string, id: any = '1') {
        const loading = await this.loadingController.create({
            message: message,
            id: id
        });
        return await loading.present();
    }

    async dismiss(id: any = '1') {
        return await this.loadingController.dismiss(null, null, id);
    }
}
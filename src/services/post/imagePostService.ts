import { Injectable } from "@angular/core";
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export default class ImagePostService {

    constructor(private actionSheet: ActionSheetController,
        private camera: Camera) { }

    /**
     * Method to select image
     */
    async selectImage(): Promise<any> {
        const p = new Promise<any>(async (resolve, reject) => {
            const select = await this.actionSheet.create({
                header: 'Select Image Source',
                buttons: [
                    {
                        text: 'Load fom Local',
                        handler: () => {
                            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY).then(imageData => {
                                resolve(imageData);
                            }, err => {
                                reject(err);
                            })
                        }
                    }, {
                        text: 'User Camera',
                        handler: () => {
                            this.pickImage(this.camera.PictureSourceType.CAMERA).then(imageData => {
                                resolve(imageData);
                            }, err => {
                                reject(err);
                            })
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    }
                ]
            });

            select.present();
        });

        return p;
    }


    /**
     * Method to get the image from the source type selected.
     * 
     * @param sourceType 
     */
    private async pickImage(sourceType): Promise<any> {
        const prom = new Promise<any>((resolve, reject) => {
            const options: CameraOptions = {
                quality: 100,
                sourceType: sourceType,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE
            }

            this.camera.getPicture(options).then(imageData => {
                resolve(imageData);
            }, err => {
                reject(err);
            })
        })

        return prom;
    }
}
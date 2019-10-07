import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { FileChooser, FileChooserOptions } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { CaptureError, CaptureVideoOptions, MediaCapture, MediaFile } from '@ionic-native/media-capture/ngx';

@Injectable({
    providedIn: 'root'
})
export default class VideoPostService {

    constructor(private actionSheet: ActionSheetController,
        private mediaCapture: MediaCapture,
        private file: File,
        private filePathNative: FilePath,
        private fileChooser: FileChooser) { }

    /**
     * Method for source video selection.
     */
    async selectVideo(): Promise<any> {
        const p = new Promise<any>(async (resolve, reject) => {
            const selector = await this.actionSheet.create({
                header: 'Select Video Source',
                buttons: [
                    {
                        text: 'Load from Local',
                        handler: () => {
                            this.browseVideo().then(data => {
                                resolve(data);
                            }, err => {
                                reject(err);
                            })
                        }
                    }, {
                        text: 'Video Camera',
                        handler: () => {
                            this.captureVideo().then(data => {
                                resolve(data);
                            }, err => {
                                reject(err);
                            })
                        }
                    }, {
                        text: 'Cancel',
                        role: 'cancel'
                    }
                ]
            })

            selector.present();
        })

        return p;
    }

    /**
     * Take video
     */
    private captureVideo(): Promise<any> {
        const p = new Promise<any>((resolve, reject) => {
            this.mediaCapture.captureVideo({ limit: 1 }).then((data: MediaFile[]) => {
                const mFile: MediaFile = data[0];
                const filePath = mFile.fullPath;
                if (filePath) {
                    const fileName = filePath.split('/').pop();
                    let fileN = filePath.substring(0, filePath.lastIndexOf("/") + 1);

                    this.file.readAsDataURL(fileN, fileName).then((base64) => {
                        resolve(base64.split(',')[1]);
                    }, err => {
                        reject(err);
                    })
                }
            }, (err: CaptureError) => {
                reject(err);
            })
        })
        return p;
    }

    /**
     * Browse Video from local storage
     */
    private browseVideo(): Promise<any> {
        const p = new Promise<any>((resolve, reject) => {
            this.fileChooser.open({ mime: 'video/mp4' }).then(uri => {
                this.filePathNative.resolveNativePath(uri).then(file => {
                    let filePath: string = file;
                    if (filePath) {
                        const fileName = filePath.split('/').pop();
                        let fileN = filePath.substring(0, filePath.lastIndexOf("/") + 1);
                        this.file.readAsDataURL(fileN, fileName).then((base64) => {
                            resolve(base64.split(',')[1]);
                        }, err => {
                            reject(err);
                        })
                    }
                })
            }, err => {
                reject(err);
            });
        })
        return p;
    }
}
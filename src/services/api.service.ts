import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    url: string = 'http://192.168.1.35:8080'; //'https://application-server001.herokuapp.com/'; //'http://192.168.1.32:8080';

    constructor(private nativeHttp: HTTP) {
    }

    /**
     * Method to call POST Api form the server.
     * 
     * @param url 
     * @param body 
     * @param type 
     */
    public doPost(url: string, body: any, type = 'json'): Promise<any> {
        const postPromise = new Promise<any>((resolve, reject) => {
            this.nativeHttp.setDataSerializer(type);
            this.nativeHttp.sendRequest(this.url + url, {
                method: 'post',
                data: body
            }).then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            })
        })

        return postPromise;
    }

    /**
     * Method to call GET Api from server.
     * 
     * @param url 
     * @param body 
     * @param type 
     */
    public doGet(url: string, body: any, type = 'json'): Promise<any> {
        const postPromise = new Promise<any>((resolve, reject) => {
            this.nativeHttp.setDataSerializer(type);
            this.nativeHttp.sendRequest(this.url + url, {
                method: 'get',
                data: body
            }).then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            })
        })

        return postPromise;
    }
}
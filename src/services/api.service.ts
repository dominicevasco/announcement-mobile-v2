import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import Utils from './message.util';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    url: string = 'http://192.168.1.45:8080';
    // url : string = 'https://announcement-server001.herokuapp.com'
    constructor(private nativeHttp: HTTP, private util: Utils) {
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
            const apiEndpoint = this.url + url;
            console.info('POST URL : ' + apiEndpoint);
            this.nativeHttp.setDataSerializer(type);
            this.nativeHttp.sendRequest(apiEndpoint, {
                method: 'post',
                data: body
            }).then(data => {
                if (data.status === 204) {
                    this.util.showToastMessage('No content found!', 'warning');
                }
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
    public doGet(url: string, body: any = {}, type = 'json'): Promise<any> {
        const postPromise = new Promise<any>((resolve, reject) => {
            const apiEndpoint = this.url + url;
            console.info('GET URL : ' + apiEndpoint);
            this.nativeHttp.setDataSerializer(type);
            this.nativeHttp.sendRequest(apiEndpoint, {
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

    /**
     * Method to call DELETE Api form the server.
     * 
     * @param url 
     * @param body 
     * @param type 
     */
    public doDelete(url: string, body: any = {}, type = 'json'): Promise<any> {
        const deletePromise = new Promise<any>((resolve, reject) => {
            const apiEndpoint = this.url + url;
            console.info('DELETE URL : ' + apiEndpoint);
            this.nativeHttp.setDataSerializer(type);
            this.nativeHttp.sendRequest(apiEndpoint, {
                method: 'delete',
                data: body
            }).then(data => {
                if (data.status === 204) {
                    this.util.showToastMessage('No content found!', 'warning');
                }
                resolve(data);
            }).catch(error => {
                reject(error);
            })
        })

        return deletePromise;
    }

}
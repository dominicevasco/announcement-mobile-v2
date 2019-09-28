import { Injectable } from "@angular/core";
import { LoginAbstract } from './abstract.login';
import { User } from 'src/model/user';

@Injectable({
    providedIn: 'root'
})
export default class DefaultAccountService extends LoginAbstract {

    login(username: any, password: any): Promise<any> {
        const login = new Promise((resolve, reject) => {
            this.afuth.auth.signInWithEmailAndPassword(username, password).then(res => {
                const isVefified = res.user.emailVerified
                //check if email verified
                if (isVefified) {
                    resolve(res);
                } else {
                    this.afuth.auth.currentUser.sendEmailVerification();
                    const err = new Error('Email not yet verified.<br/>Please check your email and verify.')
                    reject(err);
                }
            }, err => {
                reject(err);
            })
        })

        return login;
    }

    register(username: any, password: any): Promise<User> {
        const register = new Promise<User>((resolve, reject) => {
            //create email and password account in firebase
            this.afuth.auth.createUserWithEmailAndPassword(username, password).then(res => {
                //send email first
                res.user.sendEmailVerification().then(() => {
                    const user = new User()
                    user.email = username;
                    this.util.showToastMessage('Please check your email for account activation.','success');
                    resolve(user);
                })
            }, err => {
                console.log(err);
                reject(err);
            })
        });

        return register;
    }



}
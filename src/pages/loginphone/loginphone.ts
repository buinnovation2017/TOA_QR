import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the LoginphonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loginphone',
  templateUrl: 'loginphone.html',
})
export class LoginphonePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginphonePage');
  }

  goExhangeCoin(){
    this.navCtrl.push("ExchangecoinPage");
  }

  goHome(){
    console.log("pop page");
    this.navCtrl.pop();
  }

}

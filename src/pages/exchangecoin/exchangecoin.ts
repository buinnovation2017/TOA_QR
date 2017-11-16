import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';



@IonicPage()
@Component({
  selector: 'page-exchangecoin',
  templateUrl: 'exchangecoin.html',
})
export class ExchangecoinPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private qrScanner: QRScanner) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExchangecoinPage');
  }

  scan(){
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      this.qrScanner.show();
    })
    
  }

}

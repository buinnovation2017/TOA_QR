import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@IonicPage()
@Component({
  selector: 'page-exchangecoin',
  templateUrl: 'exchangecoin.html',
})
export class ExchangecoinPage {

  data = "Press button to scan...";
  bath = "";
  format = "Press button to scan...";

  Count20 = 0;
  Count30 = 0;
  Count60 = 0;

  // private barcodeScanner: BarcodeScanner
  constructor(public navCtrl: NavController
        , private barcodeScanner: BarcodeScanner ) {

  }

  QRScan() {
    this.barcodeScanner.scan().then((barcodeData) => {
      console.dir(barcodeData);
      this.data = barcodeData.text;
      this.bath = this.data.substring(0,2);
      this.format = barcodeData.format;
      
      this.CountCoin();
    }, (error) => {
      alert(error);
    });
  }

  CountCoin(){
    if(this.bath == '20')
      this.Count20 += 1;
    else if(this.bath == '30')
      this.Count30 += 1;
    else if(this.bath == '60')
      this.Count60 += 1;
    
  }
}


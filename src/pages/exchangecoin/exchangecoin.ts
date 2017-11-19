import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

//API
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-exchangecoin',
  templateUrl: 'exchangecoin.html',
})
export class ExchangecoinPage {
  
  data = "Data scan...";
  bath = "";
  format = "Press button to scan...";

  Count20 = 0;
  Count30 = 0;
  Count60 = 0;

  status;
  connectionObject = { name:'pon.db', location:'default' };
  messageArray = [];
  apiData = [];
  
  

  constructor(
          public navCtrl: NavController
        , private barcodeScanner: BarcodeScanner 
        , public platform : Platform
        , public db: SQLite
        , public http : Http
      ) {
              
               this.platform.ready().then(
                 () => {

                  this.db.create(this.connectionObject).then(
                      (conObject: SQLiteObject) => { 
                        this.status = "Database ready.";

                        // let sqldropT = "DROP TABLE Messages";
                        let sqldropT = "DROP TABLE IF EXISTS Messages";
                        let sql = "CREATE TABLE IF NOT EXISTS Messages (id INTEGER PRIMARY KEY AUTOINCREMENT, messege TEXT,scan TEXT)";
                        //conObject.executeSql(sqldropT, {});
                        conObject.executeSql(sql, {}).then(
                          () => { 
                            this.status = "Table is ready.";
                            this.load();
                          }
                          , (error) => { this.status = "Error in create table: " + error.message }
                        )
                      }
                      , (error) => { this.status = "Error in create database." }
                    );
        
                 }
                 , (error) => { this.status = "Error in ready platform. " }
               );

               this.LoadJson();
               this.QRScan();
          }

  QRScan() {
    this.barcodeScanner.scan({
      showFlipCameraButton : true, // iOS and Android
      showTorchButton : true, // iOS and Android
      // torchOn: true, // Android, launch with the torch switched on (if available)
      // prompt : "Place a barcode inside the scan area", // Android
      // resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
    }).then((barcodeData) => {
      console.dir(barcodeData);

      this.data = barcodeData.text;
      this.bath = this.data.substring(0,2);
      this.format = barcodeData.format;
      
      this.save(this.data);
      this.messageArray = [];
      this.messageArray.push(barcodeData.text);
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


  // ==== SQLite ===
  save(message){
    if(message != ""){
        let sql = "INSERT INTO Messages (messege,scan) VALUES (?,?)";
        let statusScan = this.matchScan(message);
        this.db.create(this.connectionObject).then(
          (conObject:SQLiteObject) => {
            conObject.executeSql(sql, [message,statusScan]).then(
              () => { 
                this.status = "Message saved successful.";
                this.load(); 
              }
              , (error) => { this.status = "Error insert new message: " + error.message }
            )
    
          }
          , (error) => { this.status = "Error open db for insert: " + error.message }
        )
    }else{this.load();
    }    
  }

  matchScan(message){
    let statusFalse = "F";


    this.apiData.forEach(element => {
            if (message === element.code) // you iterate over items, not names, which it an Json property inside item
            {
              if(element.use === "1")
              statusFalse = "U";
              else
              statusFalse = "";
            }
    });


   return statusFalse;
  }
      
  load(){
        let sql = "SELECT * FROM Messages ORDER BY id DESC";
    
        this.db.create(this.connectionObject).then(
          (conObject:SQLiteObject) => {
    
            conObject.executeSql(sql, {}).then(
              (result) => { 
                this.status = "Load successful."; 
    
                if(result.rows.length > 0){
    
                  this.messageArray = [];
    
                  for (var i = 0; i < result.rows.length; i++) {
                    this.messageArray.push(result.rows.item(i));
                    
                  }
                }
                else{
                  this.messageArray = [];
                  this.messageArray.push("");
                  this.messageArray.pop();
                }
              }
              , (error) => { this.status = "Error insert new message: " + error.message }
            )
    
          }
          , (error) => { this.status = "Error open db for insert: " + error.message }
        )
      }

  DataClear(){
    let sql = "DELETE FROM  Messages";

    this.db.create(this.connectionObject).then(
      (conObject:SQLiteObject) => {

        conObject.executeSql(sql, {}).then(
          (result) => { 
            this.status = "Delete successful."; 
            this.load();

            this.Count20 = 0;
            this.Count30 = 0;
            this.Count60 = 0;
          }
          , (error) => { this.status = "Error insert new message: " + error.message }
        )

      }
      , (error) => { this.status = "Error open db for insert: " + error.message }
    )
  }
          

  LoadJson(){
    // let url = 'https://api.myjson.com/bins/6e6jv';
    let url = 'https://api.myjson.com/bins/1d7wxz';
    
    this.http.get(url).map(res => {
            return res.json();
          }).subscribe(data => {
            this.apiData = data;
          });
  }


  goReportScan(){
    this.navCtrl.push("RptscanPage");
  }

}


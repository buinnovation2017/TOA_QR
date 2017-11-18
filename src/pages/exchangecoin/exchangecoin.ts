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
        
                        let sql = "CREATE TABLE IF NOT EXISTS Messages (id INTEGER PRIMARY KEY AUTOINCREMENT, messege TEXT,isScan TEXT)";
        
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
          }

  QRScan() {
    this.barcodeScanner.scan().then((barcodeData) => {
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
    
        let sql = "INSERT INTO Messages (messege) VALUES (?)";
    
        // db.create(connection object).then( obj: SQLiteObject )
        //    obj.executeSql(sql, [])
    
        this.db.create(this.connectionObject).then(
          (conObject:SQLiteObject) => {
    
            conObject.executeSql(sql, [message]).then(
              () => { 
                this.status = "Message saved successful.";
                this.load(); 
              }
              , (error) => { this.status = "Error insert new message: " + error.message }
            )
    
          }
          , (error) => { this.status = "Error open db for insert: " + error.message }
        )
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
            let url = 'https://api.myjson.com/bins/6e6jv';
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


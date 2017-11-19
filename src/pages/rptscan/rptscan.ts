import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-rptscan',
  templateUrl: 'rptscan.html',
})

export class RptscanPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: SQLite) {
    this.load();
  }


  status;
  connectionObject = { name:'pon.db', location:'default' };
  messageArray = [];
  rowCount= [];
  $iIndex = 0;

     
  load(){
    let sql = "SELECT *,substr(messege, 1, 2) as CoinBath  FROM Messages  ORDER BY id DESC";

    this.db.create(this.connectionObject).then(
      (conObject:SQLiteObject) => {

        conObject.executeSql(sql, {}).then(
          (result) => { 
            this.status = "Load successful."; 

            if(result.rows.length > 0){

              this.messageArray = [];
              this.rowCount = [];
              for (var i = 0; i < result.rows.length; i++) {
                this.messageArray.push(result.rows.item(i));
                this.rowCount.push(i);
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

  indexof = ""
  removeQR(index){
    console.log(index);
    this.indexof = index;
    
    this.removeData(index);

  }


  removeData(index){
    let sql = "DELETE FROM  Messages WHERE id =" + index;

    this.db.create(this.connectionObject).then(
      (conObject:SQLiteObject) => {
        conObject.executeSql(sql, {}).then(
          (result) => { 
            this.status = "Delete successful."; 
            this.load();
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
          }
          , (error) => { this.status = "Error insert new message: " + error.message }
        )

      }
      , (error) => { this.status = "Error open db for insert: " + error.message }
    )
  }

}

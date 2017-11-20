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
  messageArray20 = [];
  
  rowCount= [];
  $iIndex = 0;
  sumCoin = 0;

     
  load(){
    // let sql = "SELECT *,substr(messege, 1, 2) as CoinBath  FROM Messages  ORDER BY id DESC";
    let sql = "SELECT *,substr(messege, 1, 2) as CoinBath  FROM Messages  ORDER BY id ASC";

    this.db.create(this.connectionObject).then(
      (conObject:SQLiteObject) => {

        conObject.executeSql(sql, {}).then(
          (result) => { 
            this.status = "Load successful."; 

            this.sumCoin = 0;
            this.messageArray = [];
            this.rowCount = [];
            if(result.rows.length > 0){
              for (var i = 0; i < result.rows.length; i++) {
                this.messageArray.push(result.rows.item(i));
                this.sumCoin += parseInt(result.rows.item(i).CoinBath,10);
                this.rowCount.push(i);

                if(result.rows.item(i).CoinBath == '20')
                {
                this.messageArray20.push(result.rows.item(i));
                }
              }
            }
            else{
              this.sumCoin = 0;
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

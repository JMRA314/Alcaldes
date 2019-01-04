//import { HttpClient} from '@angular/common/http';
import {Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Toast} from '@ionic-native/toast';


/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  private db : SQLiteObject;
  private isOpen :boolean;


  constructor(
    //public httpClient: HttpClient,
    public http : Http,

    public storage:SQLite,
    public toast :Toast) {
    //console.log('Hello DatabaseProvider Provider');
this.crearBase();




}
crearBase(){
  if (!this.isOpen) {
    this.storage = new SQLite();
    this.storage.create({ name: "alcaldes.db", location: "default" }).then((db: SQLiteObject) => {
      this.db = db;
      db.executeSql("CREATE TABLE IF NOT EXISTS incidencias(id text primary key,nombre text, correo text,telefono text, latitud text, longitud text, fecha text,observaciones text)", []);
      this.isOpen = true;
    }).catch((error) => {
      console.log(error);
    })
  }   
  
}
CrearIncidencia(id:string,nombre:string,correo:string,telefono:string,latitud:string,longitud:string,fecha:string,observaciones: string){

return new Promise ((resolve, reject) => {
  let sql = "INSERT INTO incidencias (id,nombre,correo,telefono,latitud,longitud,fecha,observaciones) VALUES (?,?,?,?,?,?,?,?)";
  this.db.executeSql(sql, [id,nombre,correo,telefono,latitud,longitud,fecha,observaciones]).then((data) =>{
    resolve(data);
  }, (error) => {
    reject(error);
  });
});


} 
listarIncidencias(){
return new Promise((resolve,reject)=>{
  this.db.executeSql("SELECT * FROM incidencias",[]).then((data) => {
let arrayIncidencias =[];
if(data.rows.length > 0){
  for(var i = 0;i < data.rows.lenght;i++){
    arrayIncidencias.push({
      id: data.rows.item(i).id,
      nombre: data.rows.item(i).nombre,
      correo: data.rows.item(i).correo,
      telefono: data.rows.item(i).telefono,
      latitud: data.rows.item(i).latitud,
      longitud: data.rows.item(i).longitud,
      fecha: data.rows.item(i).fecha,
      observaciones: data.rows.item(i).observaciones,
    });
  }
}
resolve(arrayIncidencias);
  },(error)=>{
    reject(error);
  })

})



}
}
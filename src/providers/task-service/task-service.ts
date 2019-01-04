import { Http} from '@angular/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { AlertController,LoadingController ,normalizeURL,ToastController} from 'ionic-angular';
import {CargaProvider} from '../../providers/carga/carga';
import {Toast} from '@ionic-native/toast';

import { FirebaseService } from '../../pages/service/firebase.service';
import { Storage } from '@ionic/storage';


/*
  Generated class for the TaskServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TaskServiceProvider {
  plaza : string=''
  db: SQLiteObject = null;
  incidence : any;
  sql_query:string;
  check : boolean = false;
  imageURI:any;
imageFileName:any;
url:string ="quedo vacia";
urlPhoto :string
  id : string ="";
  nombre:string;
  cuenta : string;
  correo: string;
  telefono: string;
  tipo : number;
  observaciones : string;
  latitud : string;
  longitud: string;
  fecha : string;
  foto : string;
  idplaza : number;
  query = "https://implementta.net/andro/IncidenciasAlcaldes.aspx?query=sp_CargaIncidenciaP  ";
  returnValue : any;

  constructor(public http: Http, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public carga : CargaProvider,public toast :Toast,
             
              public firebaseService: FirebaseService,
              public toastCtrl: ToastController,
              public storage: Storage
    ) {
    
 
    console.log('Hello TaskServiceProvider Provider');
  }
  setDatabase(db: SQLiteObject){
    if(this.db === null){
      this.db = db;
    
    }
    
  }
  


 
  createTable(){
     //this.storage.set('Plaza', '');
    // this.plaza();
    let sql = 'CREATE TABLE IF NOT EXISTS incidencias(id TEXT ,nombre TEXT,account TEXT, correo TEXT,telefono TEXT, latitud TEXT, longitud TEXT, fecha TEXT, observaciones TEXT,tipo INTEGER,cargado INTEGER NOT NULL DEFAULT 0,foto TEXT,plaza INTEGER)';
    return this.db.executeSql(sql, []);
  }
  getAll(){
      let sql = 'SELECT * FROM incidencias';
    return this.db.executeSql(sql, [])
    .then(response => {
      this.incidence = [];
      for (let index = 0; index < response.rows.length; index++) {
        this.incidence.push( response.rows.item(index) );
      }

      return Promise.resolve( this.incidence);
    
    })
    .catch(error => Promise.reject(error));
  }


  create(task: any){
 
    let tipo: number;
   
    tipo =  parseInt(task.tipo);
  
    console.log(task.idplaza + ' es la plaza que se metera');
    let sql = 'INSERT INTO incidencias(id,nombre,account,correo,telefono,latitud,longitud,fecha,observaciones,tipo,foto,plaza) VALUES(?,?,?,?,?,?,?,DateTime(),?,?,?,?)';
    return this.db.executeSql(sql, [task.id,task.name,task.cuenta,task.email,task.telefono,task.latitud,task.longitud,task.observaciones,tipo,task.foto,task.idplaza]);
  }
  update(task: any){
    let sql = 'UPDATE incidencias SET account=?, nombre=?,correo = ?, telefono = ? , observaciones=?, tipo = ? WHERE id=?';
    return this.db.executeSql(sql, [task.cuenta,task.name,task.email,task.telefono,task.observaciones,task.tipo,task.id]);
  }

  sicronizadoUpdate(id : string){
let sql = "UPDATE incidencias SET cargado = 1 WHERE id = ?"
    return this.db.executeSql(sql, [id]);

  }
  
  delete(task: any){
    let sql = 'DELETE FROM incidencias WHERE id=?';
    return this.db.executeSql(sql, [task.id]);
  }


   async upAll(){
 
  let sql = 'SELECT * FROM incidencias where cargado = 0';
  try {
        const result = await this.db.executeSql(sql, []);
        if (result.rows.length <=0){

          this.toast.show('No hay registros para sincronizar', '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
                 );
          
        }
else{
        for (let i = 0; i < result.rows.length; i++) {
          //let plaza : number;
          this.id = result.rows.item(i).id;
          this.nombre = result.rows.item(i).nombre;
          this.cuenta = result.rows.item(i).account;
          this.telefono = result.rows.item(i).telefono;
          this.correo = result.rows.item(i).correo;
          this.tipo = result.rows.item(i).tipo;
          this.observaciones = result.rows.item(i).observaciones;
          this.latitud = result.rows.item(i).latitud;
          this.longitud = result.rows.item(i).longitud;
          this.fecha = result.rows.item(i).fecha;
          this.foto = result.rows.item(i).foto;
          this.idplaza = result.rows.item(i).plaza;

         //carga de la photo
         let image = normalizeURL(this.foto);
          const photoURL = await this.firebaseService.uploadImage(image,this.id);
          //this.url = photoURL;
         
          this.url = photoURL;
          let index = this.url.indexOf("&")
          let nuevaURL1 = this.url.substring(0,index);
          let fotoURL = normalizeURL (nuevaURL1);
     
          this.sql_query = this.query + "'"+fotoURL+"','"+ this.nombre + "','" + this.cuenta + "','" + this.telefono + "','" + this.correo + "','" + this.tipo + "','" + this.observaciones + "','" + this.latitud + "','" + this.longitud + "','" + this.fecha + "','" + this.idplaza+ "'"; 
          this.sicronizadoUpdate(this.id);
          this.carga.upData(this.sql_query).then(data => {
            this.returnValue = data;
            console.log(data);
          }).catch(error => Promise.reject(error));
        }
        return Promise.resolve("Executed query");
      }
    }
      catch (error_1) {
        return Promise.reject(error_1);
      }
 }

}

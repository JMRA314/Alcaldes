import { HttpClient  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Toast} from '@ionic-native/toast';

/*
  Generated class for the CargaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class CargaProvider {

 

  constructor(public http: HttpClient,public toast :Toast) {
    console.log('Hello CargaProvider Provider');
  }

  

  upData(query:string) {
    return new Promise(resolve => {
      this.http.post(query,null).subscribe(data => {
        this.toast.show('Registro(s) cargado(s)', '2000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
               );
        
        resolve(data);
      }, err => {
        this.toast.show('Problemas con la red. Intentalo mas tarde', '3000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
               );
        console.log(err);
      });
    });
  }




}

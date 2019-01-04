import { Component } from '@angular/core';
import { Platform,Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { HomePage } from '../pages/home/home';
import { TaskServiceProvider} from '../providers/task-service/task-service';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { NetworkProvider } from '../providers/network/network';
import {Toast} from '@ionic-native/toast';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  
 

  constructor(platform: Platform,
     statusBar: StatusBar,
     public splashScreen: SplashScreen,
      public sqlite: SQLite,
      public tasksService : TaskServiceProvider,
      public alertCtrl: AlertController,
      public storage: Storage,public events: Events,
      public network: Network,
      public networkProvider: NetworkProvider, public toast : Toast
    ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
   
      this.createDatabase();
      this.checarNetwork();
     // splashScreen.hide();

    });
  }


  checarNetwork(){

	        this.networkProvider.initializeNetworkEvents();

	       		// Offline event
			    this.events.subscribe('network:offline', () => {
            this.toast.show('Se ha desconectado la red', '1500', 'center').subscribe(
              toast => {
                console.log(toast);
              }
                   );
			    });

			    // Online event
			    this.events.subscribe('network:online', () => {

            this.toast.show('Se ha conectado a '+this.network.type, '1500', 'center').subscribe(
              toast => {
                console.log(toast);
              }
                   );
              this.tasksService.upAll().then((data)=>{
                console.log(data);     
            },(error)=>{
              console.log(error);
                });
              
			    });

    
  }





  private createDatabase(){
    
    this.sqlite.create({
      name: 'alcaldes.db',
      location: 'default' // the location field is required
    })
    .then((db) => {
      this.tasksService.setDatabase(db);
    
      return this.tasksService.createTable();
    })
    .then(() =>{
      this.plaza();
     this.splashScreen.hide();
      this.rootPage = HomePage;
      
    })
    .catch(error =>{
      
      console.error(error);
    });
  }


  plaza(){
    this.storage.get('Plaza').then((cont=>{ 
  if(cont==null){
  this.doRadio();
  }
  
    }));

   }
 
   
   doRadio() {
    
 let alert = this.alertCtrl.create();
     alert.setTitle('Elija su ciudad');
   
     alert.addInput({
       type: 'radio',
       label: 'Culiacan',
       value: '1'
       
     });
   
     alert.addInput({
       type: 'radio',
       label: 'Vallarta',
       value: '2'
     });
   
     alert.addInput({
       type: 'radio',
       label: 'Tijuana',
       value: '3'
     });
   
     alert.addInput({
       type: 'radio',
       label: 'Tuxpan',
       value: '4'
     });
   
   
   
     alert.addButton('Cancelar');
     alert.addButton({
       text: 'Guardar',
       handler: data => {
       
         this.storage.set('Plaza', data);

            this.storage.get('Plaza').then((valor)=>{
          console.log(valor+' esta es la plaza seleccionada');
        })
        
         
  
       }
     });
   
     alert.present().then(() => {
       //this.testRadioOpen = true;
     });
   }
   


}


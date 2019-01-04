import { Component } from '@angular/core';
import { IonicPage, NavController,AlertController, NavParams, ViewController,ModalController } from 'ionic-angular';
import { TaskServiceProvider } from '../../providers/task-service/task-service';
import { HomePage }  from '../home/home';
import { EditarPage } from '../editar/editar';
import { Network } from '@ionic-native/network';
import {Toast} from '@ionic-native/toast';


/**
 * Generated class for the VerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ver',
  templateUrl: 'ver.html',
})
export class VerPage {
  incidence : any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
      public tasksService : TaskServiceProvider,
      public viewCtrl:ViewController,
      public alertCtrl :AlertController,
      public modalCtrl : ModalController, public network: Network ,public toast : Toast) {
    this.listarIncidencias();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerPage');
  }
  listarIncidencias(){
    this.tasksService.getAll().then((data)=>{
    

    console.log(data);

    this.incidence = data;
    if (this.incidence.length <=0){
      this.mensaje();
    }
      
    },(error)=>{
      console.log(error);
    })
    
    
    }

    subirSQL(){
      if(this.network.type =='none'){
        this.toast.show('Sin red disponible', '2000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
               );
               this.viewCtrl.dismiss(HomePage);

      }else{
        this.tasksService.upAll().then((data)=>{
         // console.log(data);
                this.viewCtrl.dismiss(HomePage);
  
      },(error)=>{
        console.log(error);
          })

      }

    }

    mensaje() {
      const alert = this.alertCtrl.create({
        title: 'No hay registros',
        subTitle:'No existe ningun registro de incidencias.',
        buttons: ['OK']
      });
      alert.present();
    }


    eliminar(item){

      this.tasksService.delete(item).then((data)=>{
        console.log(data);
             this.listarIncidencias();

    },(error)=>{
      console.log(error);
        })

    }
    
    editar(item){

      var modal = this.modalCtrl.create(EditarPage,item);
      modal.onDidDismiss((result)=>{
      console.log('resultado ' + result);
      this.listarIncidencias();
   
      })
      modal.present();
    }


    }


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ModalController,AlertController } from 'ionic-angular';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import {Toast} from '@ionic-native/toast';
import { HomePage } from '../home/home';
import { TaskServiceProvider } from '../../providers/task-service/task-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the IncidenciaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-incidencia',
  templateUrl: 'incidencia.html',
})
export class IncidenciaPage {

      validar1: boolean =true;
      validar2: boolean =false;
      contador : number = 200;
      image : string = null;
      foto : string = null;
      incidence : any
      formulario : FormGroup;
      ParametroRecibido: any;
      parametros: any;
      idplaza : number;




  constructor(public toast :Toast,

    public formBuilder: FormBuilder,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public tasksService : TaskServiceProvider,
    public viewCtrl : ViewController,
    public modalCtrl : ModalController,
    private camera: Camera,
    private alertCtrl:AlertController,
    public storage : Storage) {

    this.formulario = this.createMyForm();
    this.ParametroRecibido = navParams.data;
    this.checkPlaza();

  }
  onKey(event){
    this.contador = this.contador - 1;
   }

      ionViewDidLoad() {
        console.log('ionViewDidLoad IncidenciaPage');
    
      }
      private createMyForm(){
        return this.formBuilder.group({
          name: ['', Validators.required],
          cuenta :'',
          telefono: ['', Validators.required],
          email: ['', Validators.required],
          tipoincidencia: ['', Validators.required],
          Descripcion: ['', Validators.required],
                
        });
      }


crearIncidencias(){
    
    this.parametros = {
    id : this.ParametroRecibido.id,
    name : this.formulario.value.name,
    cuenta : this.formulario.value.cuenta,
    email: this.formulario.value.email,
    telefono : this.formulario.value.telefono,
    latitud : this.ParametroRecibido.latitud,
    longitud : this.ParametroRecibido.longitud,
    observaciones : this.formulario.value.Descripcion,
    tipo : this.formulario.value.tipoincidencia,
    foto : this.image,
    idplaza: this.idplaza
}
  
this.tasksService.create(this.parametros).then((data)=>{
  console.log(data);
this.tasksService.upAll().then((data)=>{
  console.log(data);
});

  this.toast.show('Registro guardado', '5000', 'center').subscribe(
    toast => {
      console.log(toast);
    }
         );
},(error)=>{

  this.toast.show('El registro se guardó pero no se pudo cargar al servidor', '5000', 'center').subscribe(
    toast => {
      console.log(toast);
    }
         );


  console.log(error);
})
}


getAllIncidence(){
  this.tasksService.getAll()
  .then(tasks => {
    this.incidence = tasks;
  })
  .catch( error => {
    console.error( error );
  });
}



updateIncidence(task, index){
  task = Object.assign({}, task);
  task.completed = !task.completed;
  this.tasksService.update(task)
  .then( response => {
    this.incidence[index] = task;
  })
  .catch( error => {
    console.error( error );
  })
}

deleteIncidence(task: any, index){
  this.tasksService.delete(task)
  .then(response => {
    console.log( response );
    this.incidence.splice(index, 1);
  })
  .catch( error => {
    console.error( error );
  })
}

tomarFoto(){
 
  let options : CameraOptions ={
    quality : 50,
    destinationType : this.camera.DestinationType.FILE_URI,
    sourceType : this.camera.PictureSourceType.CAMERA,
    encodingType: this.camera.EncodingType.JPEG,
    targetHeight :1000,
    targetWidth : 1000,
    saveToPhotoAlbum: true
  }
  this.camera.getPicture(options).then(imageData =>{
 //this.image = `data:image/jpeg;base64,${imageData}`;
 this.image = imageData;
 console.log(this.image);
 if(this.image != null){

 
  this.validar1 = false;
  this.validar2 = true;


 }







  })
  .catch(error =>{
    console.error( error);
  })
   
    }

registrar() {
    const confirm = this.alertCtrl.create({
      title: 'Cargar Incidencia',
      message: '¿Deseas cargar ahora la incidencia o más tarde?',
      buttons: [
        {
          text: 'Cargar ahora',
          handler: () => {
            console.log('Cargar ahora');
            this.salir();

          }
        },
        {
          text: 'Cargar despues',
          handler: () => {
            this.salir();
            console.log('Cargar despues');
          }
        }
      ]
    });
    confirm.present();
  }



salir(){

  this.crearIncidencias();
  this.viewCtrl.dismiss(HomePage);

}
checkPlaza(){
  this.storage.get('Plaza').then((value)=>{
    
  if (value==null){
    const alert = this.alertCtrl.create({
      title: 'Elejir ciudad',
      subTitle: 'No has elegido una ciudad, reinicia la aplicación y selecciona tu ciudad.',
      buttons: ['OK']
    
      
    });
    alert.present();
      
  }else{
    this.idplaza = parseInt(value);
  }

});



}
}

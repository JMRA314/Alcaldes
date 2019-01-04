import { Component } from '@angular/core';
import { NavController,AlertController,ModalController} from 'ionic-angular';
import { Geolocation,Geoposition} from '@ionic-native/geolocation';
import { IncidenciaPage } from '../incidencia/incidencia';
import { VerPage } from '../ver/ver';
import { TaskServiceProvider } from '../../providers/task-service/task-service';
import { Storage } from '@ionic/storage';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  CameraPosition,
  MarkerOptions,
  Marker,
  LatLng,
  GoogleMapOptions,
  GoogleMapsMapTypeId
} from '@ionic-native/google-maps';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
plaza :string =''


latitud : string;
longitud : string;
id_incidencia: any;
parametros : any;
check : boolean = false;
tipo : string;
  constructor(//private googleMaps : GoogleMaps,
    public navCtrl: NavController,
     public geolocation : Geolocation,
     public alertCtrl :AlertController,
     public modalCtrl : ModalController,
     
     public tasksService : TaskServiceProvider,
     public storage : Storage
     ) {
       this.setPlaza();
  
  }
 
setPlaza(){
  this.storage.get('Plaza').then((value)=>{
if(value != null){
if(value=='1'){
  this.plaza ='Culiacán'

}else if(value=='2'){
  this.plaza='Vallarta'
  
}else if(value=='3'){
  this.plaza='Tijuana'
 
} else if(value == '4'){
  this.plaza = 'Tuxpan'
 

}
}else{

  this.plaza = 'Estrategas'
}

  });




}


  ionViewDidLoad(){

 
  }
  ngAfterViewInit(){

   this.geolocationNativa ();
   }
 
 geolocationNativa (){
 
 this.geolocation.getCurrentPosition().then((geoposition : Geoposition)=>{
 
 console.log(geoposition);

 this.loadMap(geoposition);
 
 })
 
 }
 

 loadMap(position){
this.longitud = position.coords.longitude;
this.latitud = position.coords.latitude;
let options: GoogleMapOptions ={
  mapType: GoogleMapsMapTypeId.HYBRID,
  controls: {
    'compass': true,
    'myLocationButton': true,
    'myLocation': true,   // (blue dot)
    'indoorPicker': true,
    //'zoom': true,          // android only
    'mapToolbar': true     // android only
  },

  gestures: {
    scroll: true,
    tilt: true,
    zoom: true,
    rotate: true
  }



}

  let element :HTMLElement = document.getElementById('map');
  let map : GoogleMap = GoogleMaps.create(element,options);
  let latlng = new LatLng(position.coords.latitude,position.coords.longitude);
  
  
  map.one(GoogleMapsEvent.MAP_READY).then(()=>{
    var lt;
    var lg;
  
    let position : CameraPosition<LatLng>={
      target :latlng,

      zoom: 17
      
  
    };
    map.moveCamera(position);
  
  let markerOptions :MarkerOptions ={
  position : latlng,
  title:"Ubicación Actual",
  draggable : true
  
  };
 map.addMarker(markerOptions).then((marker:Marker)=>{
    

    marker.showInfoWindow();

    


    marker.addEventListener(GoogleMapsEvent.MARKER_DRAG_END).subscribe(
      data => {
        lt=marker.getPosition().lat;
        lg=marker.getPosition().lng;
        this.latitud =  lt.toString();
        this.longitud = lg.toString();

      });   

  });
  
  
  
  })
   
  }


  showAlert(mensaje:string) {
    const alert = this.alertCtrl.create({
      title: 'Conexiones a la red',
      subTitle: mensaje,
      buttons: ['OK']
    });
    alert.present();
  }

  incidencia(){
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    this.id_incidencia = this.latitud+''+this.longitud+''+ ionicDate.toISOString();
  this.parametros ={
    latitud  : this.latitud,
    longitud : this.longitud,
    id : this.id_incidencia
    
  };

    
  }
   
  agregar(){
    this.incidencia();
    var modal = this.modalCtrl.create(IncidenciaPage,this.parametros);
    modal.onDidDismiss((result)=>{
    console.log('resultado' + result);

    })
    modal.present();
  }

  verIncidencias(){

    var modal = this.modalCtrl.create(VerPage);
    modal.onDidDismiss((result)=>{
    console.log('resultado' + result);
 
    })
    modal.present();
  }

  cargar(){
    this.tasksService.upAll().then((data)=>{
      console.log(data);
  },(error)=>{
    console.log(error);
      })
  }

}

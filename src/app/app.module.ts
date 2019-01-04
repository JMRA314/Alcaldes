import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { IncidenciaPage } from '../pages/incidencia/incidencia';
import { VerPage } from '../pages/ver/ver';
import {EditarPage} from '../pages/editar/editar';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import {
  GoogleMaps
} from '@ionic-native/google-maps';
import { HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {SQLite} from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { Camera } from '@ionic-native/camera';
import { TaskServiceProvider } from '../providers/task-service/task-service';
import { CargaProvider } from '../providers/carga/carga';
import {AngularFireModule} from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { FirebaseService } from '../pages/service/firebase.service';
import firebase from "firebase";
import { enviroment } from '../enviroment/enviroment';
import { IonicStorageModule } from '@ionic/storage';
import { NetworkProvider } from '../providers/network/network';

firebase.initializeApp(enviroment.firebase)


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    IncidenciaPage,
    VerPage,
    EditarPage

 
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AngularFireModule.initializeApp(enviroment.firebase), // imports firebase/app needed for everything
    AngularFireStorageModule, // imports firebase/storage only needed for storage features

    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    IncidenciaPage,
    VerPage,
    EditarPage
  
   
    ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    GoogleMaps,
    SQLite,
    Toast,
    Camera,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TaskServiceProvider,
    CargaProvider,
    FirebaseService,
    NetworkProvider,
  
  ]
})
export class AppModule {}

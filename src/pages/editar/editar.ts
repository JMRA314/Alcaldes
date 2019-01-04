import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController, NavParams } from 'ionic-angular';
import { TaskServiceProvider } from '../../providers/task-service/task-service';
import { VerPage } from '../ver/ver';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
/**
 * Generated class for the EditarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editar',
  templateUrl: 'editar.html',
})
export class EditarPage {
  item : any;
  parametros : any;
  formulario : FormGroup;

  constructor(public navCtrl: NavController,
    public tasksService : TaskServiceProvider,
     public navParams: NavParams,
     public viewCtrl:ViewController,
     public formBuilder: FormBuilder,) {
      this.formulario = this.createMyForm();
       this.item = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditarPage');
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
  salir(){
this.ActualizarIncidencias();
    this.tasksService.update(this.parametros).then((data)=>{
      console.log(data);
            this.viewCtrl.dismiss(VerPage);

  },(error)=>{
    console.log(error);
      })



  }


  ActualizarIncidencias(){
    
    this.parametros = {
    id : this.item.id,
    name : this.formulario.value.name,
    cuenta : this.formulario.value.cuenta,
    email: this.formulario.value.email,
    telefono : this.formulario.value.telefono,
    observaciones : this.formulario.value.Descripcion,
    tipo : this.formulario.value.tipoincidencia,
 
}

}
}
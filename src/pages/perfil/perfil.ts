import { UsuarioService } from './../../providers/service/usuario-service';
import { UsuarioVO } from './../../model/usuarioVO';
import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  public usuario:UsuarioVO;

  constructor(private usuaSrv:UsuarioService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

  getUsuario() {
    var uid:string = this.usuaSrv.getLoggedInUser().uid;

    this.usuaSrv.getUserDetail(uid).then((snapUsua) => {
      
    })
    .catch((error) => {

    })

  }


  
}

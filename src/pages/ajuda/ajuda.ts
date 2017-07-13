import { FirebaseService } from './../../providers/database/firebase-service';
import { UsuarioVO } from './../../model/usuarioVO';
import { UsuarioService } from './../../providers/service/usuario-service';
import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AjudaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-ajuda',
  templateUrl: 'ajuda.html',
})
export class AjudaPage {

  public titulo: string = "CITADINO";
  public exibirTelaAjuda: number = 1;
  public ajudaLida: boolean = true;
  public usuario: UsuarioVO = null;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private usuaSrv: UsuarioService,
    private fbSrv: FirebaseService) {

    usuaSrv.getUserDetail(usuaSrv.getLoggedInUser().uid).then((snapUsuario) => {
      if (snapUsuario != null) {
        this.usuario = snapUsuario.val();
        this.ajudaLida = this.usuario.usua_in_ajuda;
      }
    })
  }

  ionViewDidLoad() {
  }

  public firstPage() {
    if (this.exibirTelaAjuda > 1) {
      this.exibirTelaAjuda = this.exibirTelaAjuda - 1;
      console.log(this.exibirTelaAjuda);
    }
  }

  public nextPage() {
    if (this.exibirTelaAjuda < 4) {
      this.exibirTelaAjuda = this.exibirTelaAjuda + 1;
      console.log(this.exibirTelaAjuda);
    }
  }

  public close() {
    if (this.usuario != null) {
      let update = {};
      update[`/usuario/${this.usuario.usua_sq_id}/usua_in_ajuda`] = true;

      this.fbSrv.getDataBase().ref().update(update);

    }
    this.navCtrl.setRoot(TabsPage);
  }
}

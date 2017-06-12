import { EmpresaVO } from './../../model/empresaVO';
import { MensagemVO } from './../../model/mensagemVO';
import { EmpresaService } from './../../providers/service/empresa-service';
import { UsuarioService } from './../../providers/service/usuario-service';
import { MensagemPage } from './../mensagem/mensagem';
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-mensagem-lista',
  templateUrl: 'mensagem-lista.html'
})
export class MensagemListaPage implements OnInit {
  private mensagens: Array<MensagemVO> = [];

  constructor(private usuaSrv: UsuarioService,
    private emprSrv: EmpresaService,
    private mdlCtrl: ModalController) {
  }

  ngOnInit() {
    this.loadMensagens();
  }

  private loadMensagens() {
    this.usuaSrv.getMensagens().then((users) => {
      users.forEach(user => {
        let mensagem: MensagemVO = new MensagemVO();
        this.usuaSrv.getUserDetail(user.key).then((usuario) => {

          mensagem.usua_sq_id = usuario.val().usua_sq_id;
          // mensagem.usua_uid_authentic = usuario.val().usua_uid_authentic;

          if (usuario.child('empresa').exists()) {
            usuario.child('empresa').forEach(itemEmpresa => {
              this.emprSrv.getEmpresaPorKey(
                itemEmpresa.val().empr_sq_id).then((empresa) => {
                  mensagem.empr_sq_id = empresa.val().empr_sq_id;
                  mensagem.mens_nome = empresa.val().empr_nm_razaosocial;
                  mensagem.mens_tx_logo_marca = empresa.val().empr_tx_logomarca;
                });
            });
          }
          else {
            mensagem.mens_nome = usuario.val().usua_nm_usuario;
            mensagem.mens_tx_logo_marca = usuario.val().usua_tx_url_profile;
          }
          this.mensagens.push(mensagem);
        });
      });
    });
  }

  openMensagemPage(mensagem: MensagemVO) {
    let userCurrent = this.usuaSrv.getLoggedInUser();
    let param = {
      uid: userCurrent.uid,
      interlocutor: mensagem.usua_sq_id,
      nameFrom: mensagem.mens_nome,
      pathImage: mensagem.mens_tx_logo_marca,
      user: mensagem.mens_nome.substr(0, 6)
    };

    console.log(param);
    // let param = { uid: userCurrent.uid, interlocutor: '-KjwrnGNL-oVZBYZVkdW'};

    // this.navCtrl.push(MensagemPage, param);
    let loginModal = this.mdlCtrl.create(MensagemPage, param);
    loginModal.present();
  }

  openNovaMensagem(key: any) {
    let userCurrent = this.usuaSrv.getLoggedInUser();
    // let param = { uid: userCurrent.uid, interlocutor: key };
    let param = {
      uid: userCurrent.uid,
      interlocutor: '4s9jJNIQseaOuhhXRXNjeeSNXvj2',
      //  interlocutor: 'KobfWIv3ADTP6c8fxpYuSlf7V1m1',
      nameFrom:'',
      pathImage: '',
      user: ''
    };

    let loginModal = this.mdlCtrl.create(MensagemPage, param);
    loginModal.present();
  }
}

import { ToastController, LoadingController } from 'ionic-angular';
import { TokenDeviceService } from './../../providers/service/token-device';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { NotificacaoService } from './../../providers/service/notificacao-service';
import { Component, OnInit } from '@angular/core';
import * as enums from './../../model/dominio/ctdEnum';
@Component({
  selector: 'page-enviar-notificacao',
  templateUrl: 'enviar-notificacao.html',
})

export class EnviarNotificacaoPage implements OnInit {

  formNotif: FormGroup;
  notif_tx_titulo: AbstractControl;
  notif_tx_mensagem: AbstractControl;
  toastAlert: any;

  constructor(private notifSrv: NotificacaoService,
    private fb: FormBuilder,
    private tokenSrv: TokenDeviceService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.formNotif = this.fb.group({
      'notif_tx_titulo': ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      'notif_tx_mensagem': ['', Validators.compose([Validators.required, Validators.maxLength(1000)])]
    });

    this.notif_tx_titulo = this.formNotif.controls['notif_tx_titulo'];
    this.notif_tx_mensagem = this.formNotif.controls['notif_tx_mensagem'];

  }

  onSubmit(signupForm: any): void {
    var self = this;
    var tokens: string[] = [];

    if (self.formNotif.valid) {
      self.enviarNotificacao(signupForm);
    }
  }

  private enviarNotificacao(signupForm: any) {
    var self = this;
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...',
      dismissOnPageChange: true
    });

    loader.present();

    self.pesquisarTokensNotificacao()
      .then((result: any) => {

        var tokens: string[] = result.tokens;

        if (tokens.length > 0) {
          self.notifSrv.sendUidMensagem(tokens, CtdFuncoes.ellipsis(signupForm.notif_tx_titulo, 20), CtdFuncoes.ellipsis(signupForm.notif_tx_mensagem, 1000), enums.eventTypePush.vitrine)
            .then(() => {
              this.resetForm();
              loader.dismiss();
              this.createAlert("Notificação enviada com sucesso.");

            }).catch((error) => {
              loader.dismiss();
              this.createAlert("Não foi possível enviar a notificação.");
            });
        }
        else {
          loader.dismiss();
        }
      })
  }

  private pesquisarTokensNotificacao = function () {
    var self = this;
    var tokens: string[] = [];
    var count = 0;

    var promise = new Promise(function (resolve, reject) {

      self.tokenSrv.getTokenDeviceRef().once("value")
        .then((snapTokens) => {
          if (snapTokens != null) {
            var values: any = Object.keys(snapTokens.val());

            values.forEach(element => {
              tokens.push(element);
              count++;
            });

            if (count == values.length) {
              resolve({ self, tokens });
            }
          }
          else {

            resolve({ self, tokens });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }

  resetForm() {
    for (let name in this.formNotif.controls) {
      this.formNotif.controls[name].reset();
      this.formNotif.controls[name].setErrors(null);
    }
  }

  createAlert(errorMessage: string) {

    if (this.toastAlert != null) {
      this.toastAlert.dismiss();
    }

    this.toastAlert = this.toastCtrl.create({
      message: errorMessage,
      duration: 3000,
      position: 'top'
    });

    this.toastAlert.present();
  }



}

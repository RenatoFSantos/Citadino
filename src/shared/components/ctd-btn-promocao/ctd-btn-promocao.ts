import { CupomCriadoVO } from './../../../model/cupomCriadoVO';

import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { CupomVO } from './../../../model/cupomVO';
import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';

/**
 * Generated class for the CtdBtnPromocaoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ctd-btn-promocao',
  templateUrl: 'ctd-btn-promocao.html'
})
export class CtdBtnPromocaoComponent {

  @Input()
  public isBtnPublicar: Boolean = false;

  @Input()
  public isBtnPause: Boolean = false;

  @Input()
  public isBtnExcluir: Boolean = false;

  @Input()
  public cupom: CupomCriadoVO = null;


  constructor(private alertCtrl: AlertController,
    private events: Events) {
  }

  public publicarPromocao() {
    let confirm = this.alertCtrl.create({
      title: "Cupom",
      message: "Confirma a publicação ?",
      buttons: [{
        text: "Sim",
        handler: () => {
          this.events.publish("publicarCupom", this.cupom);
        }
      },
      {
        text: "Nao",
        handler: () => {
          // confirm.dismiss();
        }
      }
      ]
    })
    confirm.present();
  }

  public showExclusao() {
    let confirm = this.alertCtrl.create({
      title: "Cupom",
      message: "Confirma a exclusão ?",
      buttons: [{
        text: "Sim",
        handler: () => {
          this.events.publish("excluirCupom", this.cupom);
        }
      },
      {
        text: "Nao",
        handler: () => {
          // confirm.dismiss();
        }
      }
      ]
    })
    confirm.present();
  }

}


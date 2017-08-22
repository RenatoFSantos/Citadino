import { NavParams } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'page-notificacao',
  templateUrl: 'notificacao.html',
})
export class NotificacaoPage {
  pushMessage: string = 'push message will be displayed here';

  constructor(public params: NavParams) {
    if (params.data.message) {
      this.pushMessage = params.data.message;
    }
  }

}

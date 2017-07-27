import { GlobalVar } from './../../shared/global-var';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/Network';
import { Events, ToastController } from 'ionic-angular';
import * as enums from './../../model/dominio/ctdEnum';


@Injectable()
export class NetworkService {

  private toast: any = null;

  constructor(private eventCtrl: Events,
    private network: Network,
    private toastCtrl: ToastController,
    private globalVar: GlobalVar) {
  }

  public initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      this.globalVar.setIsNetworkConnected(false);
      this.eventCtrl.publish('network:offline');
    });

    this.network.onConnect().subscribe(() => {
      this.globalVar.setIsNetworkConnected(true);
      this.eventCtrl.publish('network:online');
    });
  }

  public getStatusConnection() {
    if (this.network.type == enums.Connection.NONE.toString()) {
      if (this.toast != null) {
        this.toast.dismiss();
      }
      this.toast = this.toastCtrl.create({
        message: 'SEM CONEXÃO COM A INTERNET',
        position: 'top',
        showCloseButton: true,
        closeButtonText: "OK"
      });

      this.globalVar.setIsNetworkConnected(false);
      this.toast.present();

    };
  }

  public closeStatusConnection() {
    if (this.toast != null) {
      this.toast.dismiss();
      this.toast = null;
      this.globalVar.setIsNetworkConnected(true);
    }
  }


}
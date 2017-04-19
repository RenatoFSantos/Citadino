import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'ctd-header-modal',
  templateUrl: 'ctd-header-modal.html'
})
export class CtdHeaderModalComponent {

 constructor(public viewCtrl: ViewController) {
  }
  close() {
    this.viewCtrl.dismiss();
  }
}

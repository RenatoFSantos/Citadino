import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';

/*
  Generated class for the CtdHeaderModal component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
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

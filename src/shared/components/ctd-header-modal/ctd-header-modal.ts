import { ViewController } from 'ionic-angular';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ctd-header-modal',
  templateUrl: 'ctd-header-modal.html'
})
export class CtdHeaderModalComponent {

  @Input() 
  public titulo:string = "CITADINO";

  @Input() 
  public pathImage:string = "assets/img/icon.png";

 constructor(public viewCtrl: ViewController) {}

  close() {
    this.viewCtrl.dismiss();
  }

}

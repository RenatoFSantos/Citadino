import { ViewController, Events } from 'ionic-angular';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ctd-header-modal',
  templateUrl: 'ctd-header-modal.html'
})
export class CtdHeaderModalComponent {

  @Input()
  public titulo: string = "";

  @Input()
  public modal: boolean = false;

  constructor(public viewCtrl: ViewController,
    private events: Events) { }

  public close() {
    if (this.modal == false) {
      this.events.publish("anuncio_close:true", true);
    }
    else {
      this.viewCtrl.dismiss();
    }
  }
}

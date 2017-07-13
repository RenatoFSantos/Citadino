import { Events } from 'ionic-angular';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ctd-header',
  templateUrl: 'ctd-header.html'
})

export class CtdHeaderComponent {
  @Input()
  public titulo: string = "CITADINO";

  @Input()
  public pathImage: string = "assets/img/icon.png";

  @Input()
  public exibirBotao:boolean = false;

  constructor(public events: Events) {
  }
}

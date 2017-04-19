import { Events } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'ctd-header',
  templateUrl: 'ctd-header.html'
})
export class CtdHeaderComponent {

  text: string;

  constructor(public events:Events) {  
  }
}

import { Events } from 'ionic-angular';
import { Component } from '@angular/core';

/*
  Generated class for the CtdHeader component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'ctd-header',
  templateUrl: 'ctd-header.html'
})
export class CtdHeaderComponent {

  text: string;

  constructor(public events:Events) {  
  }
}

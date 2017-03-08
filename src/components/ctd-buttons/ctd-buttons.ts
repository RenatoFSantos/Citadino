import { Component } from '@angular/core';

/*
  Generated class for the CtdButtons component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'ctd-buttons',
  templateUrl: 'ctd-buttons.html'
})
export class CtdButtonsComponent {

  text: string;

  constructor() {
    console.log('Hello CtdButtons Component');
    this.text = 'Hello World';
  }

}

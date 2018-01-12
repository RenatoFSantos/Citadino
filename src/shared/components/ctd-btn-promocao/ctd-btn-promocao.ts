import { CupomVO } from './../../../model/cupomVO';
import { Component, Input } from '@angular/core';

/**
 * Generated class for the CtdBtnPromocaoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ctd-btn-promocao',
  templateUrl: 'ctd-btn-promocao.html'
})
export class CtdBtnPromocaoComponent {

  @Input()
  public isBtnPublicar:Boolean = false;

  @Input()
  public isBtnPause:Boolean = false;

  @Input()
  public cupom:CupomVO = null;


  constructor() {
  
  }

  public publicarPromocao() {
    if (this.cupom != null) {
      console.log(this.cupom);
    }
  }

}


import { MappingsService } from './../../providers/service/_mappings-service';
import { ItemsService } from './../../providers/service/_items-service';
import { UsuarioService } from './../../providers/service/usuario-service';
import { MinhaVitrineService } from './../../providers/service/minha-vitrine-service';
import { VitrineVO } from './../../model/vitrineVO';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@Component({
  selector: 'page-minha-vitrine',
  templateUrl: 'minha-vitrine.html',
})
export class MinhaVitrinePage {

  private vitrines: Array<VitrineVO> = [];
  private usuario: any;

  constructor(private minhaVitrineSrv: MinhaVitrineService,
    private usuaSrv: UsuarioService,
    private events: Events,
    private itemsService: ItemsService,
    private mappingsService: MappingsService) {

    this.usuario = this.usuaSrv.getLoggedInUser();
  }

  ionViewDidLoad() {
    this.excluirVitrineEvent();
    this.carregaMinhaVitrine();

  }

  private carregaMinhaVitrine() {
    let self = this;
    this.minhaVitrineSrv.getMinhaVitrinePorUsuario(this.usuario.uid).then((snapVitrines) => {
      if (snapVitrines != null) {
        snapVitrines.forEach(item => {
          var pkVitrine = item.val().vitr_sq_id;
          let newVitrine: VitrineVO = self.mappingsService.getVitrine(item.val(), pkVitrine);

          newVitrine.anun_nr_salvos = 1;
          this.vitrines.push(newVitrine);
        });
      }
    });
  }

  public excluirVitrineEvent() {
    let self = this;
    this.events.subscribe('excluirVitrine:true', (result) => {
      if (result != null) {
        self.itemsService.removeItemFromArray(self.vitrines, result);
      }
    });
  }
}

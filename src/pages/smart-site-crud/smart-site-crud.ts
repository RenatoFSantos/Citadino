import { MappingsService } from './../../providers/service/_mappings-service';
import { EmpresaVO } from './../../model/empresaVO';
import { EmpresaService } from './../../providers/service/empresa-service';
import { GlobalVar } from './../../shared/global-var';
import { UsuarioVO } from './../../model/usuarioVO';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-smart-site-crud',
  templateUrl: 'smart-site-crud.html',
})
export class SmartSiteCrudPage {

  public myPhoto: any;
  public empresa: EmpresaVO;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private glbVar: GlobalVar,
    private emprSrv: EmpresaService,
    private mapSrv: MappingsService) {
    this.myPhoto = 'assets/img/profile/profile.png';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SmartSiteCrudPage');
  }


  private carregaDadosEmpresa() {
    let self = this;

    var usuario: UsuarioVO = this.glbVar.usuarioLogado;

    self.emprSrv.getEmpresaByCnpj(usuario.empresa.empr_nr_documento)
      .then(snapEmpresa => {
        self.empresa = self.mapSrv.getEmpresa(snapEmpresa);
      })
      .catch((error) => {
        
      });
  }

}

import { SmartsiteVO } from './../../model/smartSiteVO';
import { SmartSiteService } from './../../providers/service/smartSite-services';
import { SmartSitePage } from './../smartSite/smartSite';
import { EmpresaVO } from './../../model/empresaVO';
import { EmpresaService } from './../../providers/service/empresa-service';
import { GuiaService } from './../../providers/service/guia-service';
import { GuiaContatoPage } from './../guia-contato/guia-contato';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-guia-lista',
  templateUrl: 'guia-lista.html'
})

export class GuiaListaPage implements OnInit {
  public categoriaNome: string = "";
  public empresas: any = [];
  public empresasKey: any = [];
  private toastAlert: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public guiaSrv: GuiaService,
    public emprSrv: EmpresaService,
    private smartSrv: SmartSiteService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController) {

    this.categoriaNome = navParams.get("categNm");
    this.empresasKey = navParams.get("emprKeys");
  }

  ngOnInit() {
    this.loadEmpresas();
  }

  ionViewDidLoad() {
  }

  openGuia(empresa: EmpresaVO) {

    if (empresa.plano.plan_in_smartsite == true) {

      this.emprSrv.getSmartSitePorEmpresa(empresa.empr_sq_id)
        .then((snapSamrEmpr) => {
          if (snapSamrEmpr.exists()) {
            let loader = this.loadingCtrl.create({
              content: 'Aguarde...',
              dismissOnPageChange: true
            });
            loader.present();
            this.smartSrv.getSmartSiteByKey(Object.keys(snapSamrEmpr.val())[0])
              .then((snapSmart) => {
                if (snapSmart.val() != null) {
                  let smartSite: SmartsiteVO;
                  smartSite = snapSmart.val();
                  this.navCtrl.push(SmartSitePage, { smartSite: smartSite, empresa: empresa });
                  loader.dismiss();
                }
              });
          }
          else {
            this.createAlert("Ops!!! Não existe smartSite cadastrado.");
          }
        });
    }
    else {
      this.navCtrl.push(GuiaContatoPage, { empresa: empresa });
    }
  }

  private loadEmpresas() {
    let self = this;
    this.carregaPromiseEmpresas()
      .then(this.preencherListaEmpresas);
  }


  //Retorna a lista de promisse das empresas;
  carregaPromiseEmpresas = function () {
    let self = this;
    let promises: any = [];
    var promise = new Promise(function (resolve, reject) {
      self.empresasKey.forEach(element => {
        promises.push(self.emprSrv.getEmpresaPorKey(element));
      });
      resolve({ promises, self });
    });
    return promise;
  };

  //Carrega a lista de empresas para exibir na guia
  preencherListaEmpresas = function (prEmpresas) {
    let promises = prEmpresas.promises;
    let self = prEmpresas.self;

    var promAll = Promise.all(promises).then(values => {
      let indexEmpresa = "";
      values.forEach((snapEmpresa: any) => {

        //Essa Rotina tem como finalidade de fazer a quebra pela primeira letra do nome do
        //parceiro
        let indexItem = snapEmpresa.val().empr_nm_razaosocial.substr(0, 1).toLocaleUpperCase();
        if (indexEmpresa == "" || indexEmpresa != indexItem) {
          indexEmpresa = indexItem;
          let empresaIndex: EmpresaVO = new EmpresaVO();
          empresaIndex.empr_nm_razaosocial = indexEmpresa;
          empresaIndex.isIndexNome = true;
          self.empresas.push(empresaIndex);
        }

        let empresa: EmpresaVO = snapEmpresa.val();

        if (snapEmpresa.child('plano').exists()) {
          snapEmpresa.child('plano').forEach(plano => {
            empresa.plano = plano.val();
          });
        }

        if (snapEmpresa.child('categoria').exists()) {
          snapEmpresa.child('categoria').forEach(categoria => {
            empresa.categoria = categoria.val();
          });
        }

        empresa.isIndexNome = false;
        self.empresas.push(empresa);
      });
    });

    return promAll;
  }



  createAlert(errorMessage: string) {

    if (this.toastAlert != null) {
      this.toastAlert.dismiss();
    }

    this.toastAlert = this.toastCtrl.create({
      message: errorMessage,
      duration: 3000,
      position: 'top'
    });

    this.toastAlert.present();
  }
}

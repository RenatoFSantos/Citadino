import { ItemsService } from './../../providers/service/_items.service';
import { MappingsService } from './../../providers/service/_mappings.service';
import { GlobalVar } from './../../shared/global-var';
import { NetworkService } from './../../providers/service/network-service';
import { VitrineVO } from './../../model/vitrineVO';
import { VitrineService } from './../../providers/service/vitrine-service';
import { NoticiaFullPage } from './../noticia-full/noticia-full';
import { AnuncioFullPage } from './../anuncio-full/anuncio-full';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';


@Component({
  selector: 'page-vitrine',
  templateUrl: 'vitrine.html'
})

export class VitrinePage implements OnInit {

  public seqMunicipio: string = "001";
  private startPk: string = "";
  private limitPage: number = 3;
  private rowCount: number = 0;
  private rowCurrent: number = 0;
  private loading: boolean = false;
  private loadCtrl: any;

  private vitrines: Array<VitrineVO> = [];
  private newVitrines: Array<VitrineVO> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private globalVar: GlobalVar,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private vitrineSrv: VitrineService,
    private netService: NetworkService,
    private mappingsService: MappingsService,
    private itemsService: ItemsService) {

    if (this.globalVar.getIsFirebaseConnected()) {

      this.loadCtrl = this.loadingCtrl.create({
        spinner: 'circles'
      });
      this.loadCtrl.present();

      this.vitrineSrv.getVitrineRef().child(this.seqMunicipio).on('child_added', this.onVitrineAdded);

      this.loadVitrines();
    }
  }

  public onVitrineAdded = (childSnapshot, prevChildKey) => {
    var self = this;
    var pkVitrine = childSnapshot.val().agen_sq_agenda;

    if (this.vitrines != null && this.vitrines.length > 0) {
      let exist: boolean = this.vitrines.some(campo =>
        campo.agen_sq_agenda == pkVitrine
      );

      if (!exist) {
        let newVitrine: VitrineVO = self.mappingsService.getThread(childSnapshot.val(), pkVitrine);
        this.newVitrines.push(newVitrine);
        this.events.publish('thread:created', this.newVitrines);
      }
    }
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.netService.getStatusConnection();
  }

  ionViewDidLeave() {
    this.netService.closeStatusConnection();
  }

  ngOnInit() {
  }

  loadVitrines() {
    var self = this;
    self.vitrines = [];
    self.vitrineSrv.getVitrineRefTotal(this.seqMunicipio).then((snapShot) => {
      self.rowCount = snapShot.numChildren();
      this.getVitrines().then(() => {
        this.loadCtrl.dismiss();
      });
    }).catch((error) => {
      this.loadCtrl.dismiss();
      console.log(error);
      self.rowCount = 0;
    })
  }

  getVitrines() {
    var self = this;

    if (self.limitPage > self.rowCount) {
      self.limitPage = self.rowCount;
    } else if (self.rowCurrent > 0 && self.limitPage > (self.rowCount - self.rowCurrent)) {
      self.limitPage = (self.rowCount - self.rowCurrent);
    } else if (self.rowCurrent > self.rowCount) {
      self.limitPage = self.rowCurrent - self.rowCount;
    } else if (self.rowCurrent > 0) {
      self.limitPage = self.limitPage + 1;
    }

    return new Promise((resolve) => {
      self.vitrineSrv.getVitrineMunicipio(self.seqMunicipio, self.limitPage, self.startPk)
        .then((snapshot) => {

          self.rowCurrent = self.rowCurrent + self.itemsService.getObjectKeysSize(snapshot.val());

          self.startPk = self.itemsService.getLastElement(self.itemsService.getKeys(snapshot.val()));

          self.itemsService.reversedItems<VitrineVO>(self.mappingsService.getThreads(snapshot))

            .forEach(function (vitrine) {
              let exist: boolean = self.vitrines.some(campo =>
                campo.agen_sq_agenda == vitrine.agen_sq_agenda
              );

              if (!exist) {
                self.vitrines.push(vitrine);
              }
            });

          resolve(true);
        });
    });
  }

  reloadVitrines(refresher) {

    if (this.newVitrines != null && this.newVitrines.length > 0) {
      this.loading = true;

      let addElement = new Promise((resolve) => {
        this.newVitrines.forEach(element => {
          this.vitrines.unshift(element);
        });

        this.loading = false;
        resolve(true);
      });

      addElement.then(() => {
        this.events.publish('threads:viewed');
        this.newVitrines = [];
        refresher.complete();
      });
    }
    else {
      this.loading = false;
      refresher.complete();
    }
  }

  doInfinite(infiniteScroll) {
    var self = this;
    if (self.rowCurrent < self.rowCount) {
      this.getVitrines().then(() => {
        infiniteScroll.complete();
      });
    }
    else {
      self.rowCurrent = self.rowCount;
      infiniteScroll.complete();
    }
  }

  // openSmartSite(site: string) {
  //   switch (site) {
  //     case 'scrapfashion':
  //       this.navCtrl.push(SsScrapfashionPage);
  //     default: {
  //     }
  //   }
  // }

  showPromocao() {
    let confirm = this.alertCtrl.create({
      title: 'Parabéns!',
      message: 'Você ganhou este cupom de desconto!<br>Guarde este número para resgatar esta promoção!<br>CTDN943587220012',
      buttons: [
        {
          text: 'Obrigado!',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  openPub(opcao: number, param: any): void {
    switch (opcao) {
      case 1:
        console.log("enviado " + param);
        this.navCtrl.push(AnuncioFullPage, { anuncio: param });
        break;
      case 2:
        this.navCtrl.push(NoticiaFullPage);
        break;
      default:
        break;
    }
  }

}


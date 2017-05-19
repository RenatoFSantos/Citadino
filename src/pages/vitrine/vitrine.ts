import { ItemsService } from './../../providers/service/items.service';
import { MappingsService } from './../../providers/service/mappings.service';
import { Observable } from 'rxjs/Observable';
import { GlobalVar } from './../../shared/global-var';
import { NetworkService } from './../../providers/service/network-service';
import { VitrineVO } from './../../model/vitrineVO';
import { AgendaService } from './../../providers/service/angenda-service';
import { NoticiaFullPage } from './../noticia-full/noticia-full';
import { SsScrapfashionPage } from './../ss-scrapfashion/ss-scrapfashion';
import { AnuncioFullPage } from './../anuncio-full/anuncio-full';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, Events, LoadingController, ViewController } from 'ionic-angular';


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

  public loading: boolean = false;
  private seqAgenda: string;

  private vitrines: Array<VitrineVO> = [];
  private newVitrines: Array<VitrineVO> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private globalVar: GlobalVar,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private agendaSrv: AgendaService,
    private netService: NetworkService,
    private mappingsService: MappingsService,
    private itemsService: ItemsService) {

    if (this.globalVar.getIsFirebaseConnected()) {

      this.agendaSrv.getAgendaRef().child(this.seqMunicipio).limitToLast(1).on('child_added', this.onVitrineAdded);

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
        this.events.publish('thread:created');
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
    self.agendaSrv.getAgendaRefTotal(this.seqAgenda, this.seqMunicipio).then((snapShot) => {
      self.rowCount = snapShot.numChildren();
      this.getVitrines();
    }).catch((error) => {
      console.log(error);
      self.rowCount = 0;
    })
  }

  getVitrines() {
    var self = this;

    let index: number = 0;

    if (self.limitPage > self.rowCount) {
      self.limitPage = self.rowCount;
    } else if (self.rowCurrent > 0 && self.limitPage > (self.rowCount - self.rowCurrent)) {
      self.limitPage = (self.rowCount - self.rowCurrent);
    } else if (self.rowCurrent > self.rowCount) {
      self.limitPage = self.rowCurrent - self.rowCount;
    } else if (self.rowCurrent > 0) {
      self.limitPage = self.limitPage + 1;
    }

    console.log("rowCount " + self.rowCount);
    console.log("rowCurrent " + self.rowCurrent);
    console.log("limitPage " + self.limitPage);

    self.agendaSrv.getAgendaMunicipio(self.seqAgenda, self.seqMunicipio, self.limitPage, self.startPk)
      .then((snapshot) => {

        self.rowCurrent = self.rowCurrent + self.itemsService.getObjectKeysSize(snapshot.val());

        self.startPk = self.itemsService.getLastElement(self.itemsService.getKeys(snapshot.val()));

        console.log("startPk " + self.startPk);

        self.itemsService.reversedItems<VitrineVO>(self.mappingsService.getThreads(snapshot))

          .forEach(function (vitrine) {
            let exist: boolean = self.vitrines.some(campo =>
              campo.agen_sq_agenda == vitrine.agen_sq_agenda
            );

            if (!exist) {
              console.log("Adicionado " + vitrine.agen_sq_agenda)
              self.vitrines.push(vitrine);
            }
          });
      });
  }

  reloadVitrines(refresher) {

    if (this.newVitrines != null && this.newVitrines.length > 0) {

      console.log("Reload");
      this.loading = true;

      let addElement = new Promise((resolve) => {
        this.newVitrines.forEach(element => {
          this.vitrines.push(element);
        });

        this.itemsService.reversedItems<VitrineVO>(this.vitrines);
        this.loading = false;
        resolve(true);
        console.log("terminei o revesse");
      });

      addElement.then(() => {
        console.log("evento view");
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
      this.getVitrines();
      infiniteScroll.complete();
    }
    else {
      self.rowCurrent = self.rowCount;
      infiniteScroll.complete();
    }
  }

  openSmartSite(site: string) {
    switch (site) {
      case 'scrapfashion':
        this.navCtrl.push(SsScrapfashionPage);
      default: {
      }
    }
  }

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

  doRefresh(refresher) {
    // this.lengthPage += 5;
    // console.log(this.lengthPage);
    // this.carregarVitrine();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  // reloadThreads(refresher) {
  //   if (this.globalVar.getIsFirebaseConnected()) {
  //     this.loadThreads(true);
  //     refresher.complete();
  //   } else {
  //     refresher.complete();
  //   }
  // }

}


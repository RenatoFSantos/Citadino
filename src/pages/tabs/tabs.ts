import { UsuarioService } from './../../providers/service/usuario-service';
import { MensagemListaPage } from './../mensagem-lista/mensagem-lista';

import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, Tabs, NavController, Events } from 'ionic-angular';
import { GuiaPage } from '../guia/guia';
import { VitrinePage } from '../vitrine/vitrine';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {
  @ViewChild('vitrineTabs') tabRef: Tabs;

  tab1Root: any = VitrinePage;
  tab2Root: any = GuiaPage;
  tab3Root: any = MensagemListaPage;
  selectedIndex: number;
  public newThreads: string = '';
  public novasMensagem: string = '';

  constructor(public nav: NavController,
    public navParams: NavParams,
    public events: Events,
    private usuaSrv: UsuarioService) {
    this.selectedIndex = navParams.data.tabIndex || 1;
  }

  ngOnInit() {
    this.newNoticeEvent();
    this.eventoNovaMensagem();
    this.totalNovasMensagens();
  }

  newNoticeEvent() {
    var self = this;

    self.events.subscribe('thread:created', (newVitrines: Array<any>) => {
      if (newVitrines != null && newVitrines.length > 0) {
        self.newThreads = newVitrines.length.toString();
      }
      else {
        self.newThreads = '';
      }
    });

    self.events.subscribe('threads:viewed', (threadData) => {
      self.newThreads = '';
    });
  }

  eventoNovaMensagem() {
    var self = this;

    self.events.subscribe('mensagem:nova', (total: number) => {
      if (total > 0) {
        self.novasMensagem = total.toString();
      }
      else {
        self.novasMensagem = '';
      }
    });
  }

  private totalNovasMensagens() {
    let totalMensage: number = 0;

    var mensPromise = this.usuaSrv.getMensagens();

    if (mensPromise != null) {
      mensPromise.then((snapMsg) => {
        snapMsg.forEach(element => {

          if (element.val() == true) {
            totalMensage++;
          }

          this.events.publish('mensagem:nova', totalMensage);
        });
      });
    }
  }

}

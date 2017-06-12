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

  constructor(public nav: NavController,
    public navParams: NavParams,
    public events: Events) {
    this.selectedIndex = navParams.data.tabIndex || 0;
  }

  ngOnInit() {
    this.startListening();
  }

  startListening() {
    var self = this;

    self.events.subscribe('thread:created', (newVitrines: Array<any>) => {
      if (newVitrines != null) {

        console.log("Tamanho " + newVitrines.length.toString());
        self.newThreads = newVitrines.length.toString();
      }
      else {
        self.newThreads = '';
      }
      // if (self.newThreads === '') {
      //   self.newThreads = '1';
      // } else {
      //   self.newThreads = (+self.newThreads + 1).toString();
      // }
    });

    self.events.subscribe('threads:viewed', (threadData) => {
      self.newThreads = '';
    });
  }
}

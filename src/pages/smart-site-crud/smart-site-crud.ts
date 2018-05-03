import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-smart-site-crud',
  templateUrl: 'smart-site-crud.html',
})
export class SmartSiteCrudPage {

  public myPhoto: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.myPhoto = 'assets/img/profile/profile.png';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SmartSiteCrudPage');
  }

}

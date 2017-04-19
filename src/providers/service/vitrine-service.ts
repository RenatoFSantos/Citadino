import { Observable } from 'rxjs/Observable';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

@Injectable()
export class VitrineService {
  
  vitrineRef: any;
  
  constructor(private fbService: FirebaseService, 
              public events: Events) { 
    let self = this;
    self.vitrineRef = fbService.getDataBase().ref('/vitrine');
  }

  findAll() {
    let self = this;
    return self.vitrineRef.orderByKey().on('value', function(snapshot) {
      return snapshot;
    });

    // return Observable.create(observer => {
    //   var result = [];
    //   let onValueChange = this.fbSrv.getConnect().database().ref('/vitrine').orderByKey().on('value',
    //     (snapshot: any) => {
    //       snapshot.forEach((childSnapshot) => {
    //         var element = childSnapshot.val();
    //         element.id = childSnapshot.key;
    //         result.push(element);
    //       });
    //       this.events.publish('vitrine:carregada', onValueChange);
    //       observer.next(result);
    //     }
    //     , (error) => {
    //       observer.error(error);
    //     })
    // });
  }

  desconectarRealTime(callback: any) {
    // this.fbSrv.getConnect().database().ref().off('value', callback);
  }

  // getPaginatedList(pageNext: number = 0): Promise<any> {
    // return new Promise((resolve, reject) => {
    //   let vitrineList: Array<any> = [];

    //   const listItens = this.fbSrv.getConnect()
    //     .database().ref('/vitrine').orderByValue()
    //     .limitToFirst(pageNext).startAt(0);
    //   listItens.once('value', snapshot => {
    //     snapshot.forEach(childSnapshot => {
    //       console.log("teste" + childSnapshot.val());
    //       vitrineList.push(childSnapshot.val());
    //       return false;
    //     });
    //   });
    //   resolve(vitrineList);
    // });
  // }
}

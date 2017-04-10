import { Observable } from 'rxjs/Observable';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

@Injectable()
export class VitrineService {

  constructor(private fbSrv: FirebaseService, public events: Events) { }

  listarTodas() {
    return Observable.create(observer => {
      var result = [];
      let onValueChange  = this.fbSrv.getConnect().database().ref('vitrine').orderByKey().on('value',
        (snapshot: any) => {
          snapshot.forEach((childSnapshot) => {
            var element = childSnapshot.val();
            element.id = childSnapshot.key;
            result.push(element);
          });
          this.events.publish('vitrine:carregada', onValueChange);
          observer.next(result);
        }
        , (error) => {
          observer.error(error);
        })
    });
  }

  desconectarRealTime(callback:any) {
    this.fbSrv.getConnect().database().ref().off('value',callback);
  }

}

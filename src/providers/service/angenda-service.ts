import { Observable } from 'rxjs/Observable';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

@Injectable()
export class AgendaService {

  private agendaRef: any;

  constructor(public fbService: FirebaseService,
    public events: Events) {
    this.agendaRef = this.fbService.getDataBase().ref('municipio_agenda');
  }

  public getAgendaRef() {
    return this.agendaRef;
  }

  public getAgendaRefTotal(seqAgenda: string, seqMunicipio: string) {
    return this.agendaRef.child(seqMunicipio).orderByChild('agen_sq_agenda').once('value');
  }

  public getAgendaMunicipio(seqAgenda: string, seqMunicipio: string, limitPage: number, startPk: string) {
    if (startPk == "") {
      return this.agendaRef.child(seqMunicipio).orderByChild('agen_sq_agenda').limitToLast(limitPage).once('value');
    } else {
      return this.agendaRef.child(seqMunicipio).orderByChild('agen_sq_agenda').limitToFirst(limitPage).startAt(startPk).once('value');
    }
  }

  public getAgendaRefByParameter(dtAgenda: string, seqMunicipio: string, pageLimit: number) {
    return this.agendaRef.child(seqMunicipio).orderByChild('agen_dt_agendada').endAt(dtAgenda).limitToLast(pageLimit).once('value');
  }

  public getTimeStamp(){
    return this.fbService.getTimeStamp();
  }

  findByParameters(dtAgenda: string, seqMunicipio: number) {
    let self = this;
    let anuncios: any[] = [];

    return Observable.create((observer) => {
      self.agendaRef.child(dtAgenda).child("/vitrine")
        .orderByChild("empr_sq_cidade")
        .equalTo(seqMunicipio)
        .once('value', snapAnuncio => {
          snapAnuncio.forEach(childAnuncio => {
            anuncios.push(childAnuncio.val());
          })

          console.log("Anuncios " + anuncios);
          observer.next(anuncios);

        }).catch((error) => {
          observer.error(error);
        });
    });
  }

  desconectarRealTime(callback: any) {
    this.fbService.getDataBase().ref().off('value', callback);
  }
}
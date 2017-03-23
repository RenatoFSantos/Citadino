import { Events } from 'ionic-angular';
import { DataService } from './data-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {
  constructor(private dtbSrv: DataService, 
        public events:Events) {
  }

  //Retorna usuário conectado
  private onAuthStateChanged(_function) {
    return this.dtbSrv.getConnect().auth().onAuthStateChanged((_currentUser) => {
      if (_currentUser) {
        // console.log("Usuario " + _currentUser.uid + " está logado com " + _currentUser.provider);
        _function(_currentUser);
      } else {
        // console.log("Usuario nao logado");
        _function(null)
      }
    });
  }

  public getUsuarioCorrente() {
    return this.dtbSrv.getConnect().auth().currentUser;
  }

  //Retorna usuario logado
  public getUsuarioLogado() {
    return Observable.create(
      observer => {
        return this.onAuthStateChanged((_currentUser) => {
          if (_currentUser) {
            return this.dtbSrv.pesquisarPorId('/usuario/', _currentUser.uid).then(
              (usuLog) => {
                console.log("Usuario encontrado");
                  console.log('entrei');
                  this.events.publish('app:netWork');
                observer.next(usuLog);
              })
              .catch((error: any) => {
                observer.error();
              });
          } else {
            console.log("Usuario nao logado");
            observer.error();
          }
        });
      });
  }

  //Logar Usuario
  logarUsuario(usuario) {
    return Observable.create(
      observer => {
        return this.dtbSrv.getConnect().auth().signInWithEmailAndPassword(usuario.email, usuario.password).then(
          (authData) => {
            console.log("Autenticação Realizada com sucesso", authData);
            observer.next(authData)
          })
          .catch((error) => {
            console.log("Falhou autenticação", error);
            observer.error(error);
          });
      });
  }
}

import { FirebaseService } from './../database/firebase-service';

import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {
  constructor(private fbSrv: FirebaseService,
    public events: Events) {
  }

  //Retorna usuário conectado
  private onAuthStateChanged(_function) {
    return this.fbSrv.getConnect().auth().onAuthStateChanged((_currentUser) => {
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
    return this.fbSrv.getConnect().auth().currentUser;
  }

  //Retorna usuario logado
  public getUsuarioLogado() {
    return Observable.create(
      observer => {
        return this.onAuthStateChanged((_currentUser) => {
          if (_currentUser) {
            return this.fbSrv.pesquisarPorId('/usuario/', _currentUser.uid).then(
              (usuLog) => {
                // console.log("Usuario encontrado" + usuLog.name);
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
        return this.fbSrv.getConnect().auth().signInWithEmailAndPassword(usuario.email, usuario.password).then(
          (authData) => {
            // console.log('teste' + authData);
            this.getUsuarioLogado().subscribe(
              (usuLogado) => {
                observer.next(usuLogado)
              }, err => {
                console.log('usuario desconectado');
              });
          })
          .catch((error) => {
            console.log("Falhou autenticação", error);
            observer.error(error);
          });
      });
  }

  logout() {
    console.log("close connection");
    return this.fbSrv.getConnect().auth().signOut()
  }
}

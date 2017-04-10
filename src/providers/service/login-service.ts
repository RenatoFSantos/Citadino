import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {
  constructor(private fbSrv: FirebaseService) {
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
            return this.fbSrv.pesquisarPorId('usuario', _currentUser.uid).then(
              (usuLog) => {
                observer.next(usuLog);
              })
              .catch((error: any) => {
                observer.error();
              });
          } else {
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
            this.getUsuarioLogado().subscribe(
              (usuLogado) => {
                observer.next(usuLogado);
              }, error => {
                throw error;
              });
          })
          .catch((error) => {
            observer.error(error);
          });
      });
  }

  logout() {
    return this.fbSrv.getConnect().auth().signOut();
  }

  salvarLogin(usuario) {
    return Observable.create(observer => {
      return this.fbSrv.getConnect().auth().createUserWithEmailAndPassword(usuario.email, usuario.password)
        .then((authData) => {
          usuario.uid = authData.uid;
          let usuRef = this.fbSrv.retornaRegistroTabela('usuario', authData.uid);
          usuRef.set(usuario);
          observer.next(usuario);
        }).catch((error) => {
          observer.error(error);
        })
    });
  }
}

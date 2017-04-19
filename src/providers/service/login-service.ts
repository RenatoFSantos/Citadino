import { UsuarioVO } from './../../model/usuarioVO';
import { UserCredentials } from './../../shared/interfaces';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {

  public usersRef: any;

  constructor(public fbService: FirebaseService) {
    let self = this;
    self.usersRef = fbService.getDataBase().ref('/usuario');
  }

  // private onAuthStateChanged(_function) {
  //   return this.fbService.getFireBase().auth().onAuthStateChanged((_currentUser) => {
  //     if (_currentUser) {
  //       _function(_currentUser);
  //     } else {
  //       _function(null)
  //     }
  //   });
  // }
  onAuthStateChanged(callback) {
    let self = this;
    return self.fbService.getFireBase().auth().onAuthStateChanged(callback);
  }

  // public getUserAuth() {
  //   return this.fbService.getFireBase().auth().currentUser;
  // }
  getLoggedInUser() {
    let self = this;
    return self.fbService.getFireBase().auth().currentUser;
  }

  //Logar Usuario
  // login(email: string, password: string) {
  //   return Observable.create(
  //     observer => {
  //       return this.fbSrv.getConnect().auth().signInWithEmailAndPassword(email, password).then(
  //         (authData) => {
  //           this.getUserDetail().subscribe(
  //             (usuLogado) => {
  //               observer.next(usuLogado);
  //             }, error => {
  //               throw "Usuário não cadastrado.";
  //             });
  //         })
  //         .catch((error) => {
  //           error.message = "Usuário não cadastrado."
  //           observer.error(error);
  //         });
  //     });
  // }
  signInUser(email: string, password: string) {
    let self = this;
    return self.fbService.getFireBase().auth().signInWithEmailAndPassword(email, password);
  }

  // logout() {
  //   return this.fbSrv.getConnect().auth().signOut();
  // }
  signOut() {
    let self = this;
    return self.fbService.getFireBase().auth().signOut();
  }

  // saveLogin(usuario: any) {
  //     return Observable.create(observer => {
  //       return this.fbSrv.getConnect().auth().createUserWithEmailAndPassword(usuario.usua_ds_email, usuario.usua_tx_senha)
  //         .then((authData) => {
  //           let usuarioRef = this.fbSrv.returnRef("usuario", authData.uid);
  //           usuarioRef.set(usuario);
  //           observer.next(usuario);
  //         }).catch((error) => {
  //           observer.error(error);
  //         })
  //     });
  //   }
  registerUser(user: UserCredentials) {
    let self = this;
    return self.fbService.getFireBase().auth().createUserWithEmailAndPassword(user.email, user.password);
  }

  addUser(user: UsuarioVO, uid: string) {
    let self = this;
    self.usersRef.child(uid).update({
      usua_nm_usuario: user.usua_nm_usuario,
      usua_ds_email: user.usua_ds_email,
      usua_tx_senha: user.usua_tx_senha
    });
  }

  setUserImage(uid: string, urlProfile) {
    this.usersRef.child(uid).update({
      usua_ds_url_profile: urlProfile,
      image: true
    });
  }

  //Retorna usuario logado
  // public getUserDetail() {
  //   return Observable.create(
  //     observer => {
  //       return this.onAuthStateChanged((_currentUser) => {
  //         if (_currentUser) {
  //           return this.fbSrv.findByKey('usuario', _currentUser.uid).then(
  //             (usuLogado) => {
  //               observer.next(usuLogado);
  //             })
  //             .catch((error: any) => {
  //               observer.error();
  //             });
  //         } else {
  //           observer.error();
  //         }
  //       });
  //     });
  // }

  getUserDetail(): any {
    let self = this;
    return Observable.create(
      observer => {
        if (self.getLoggedInUser() != null) {
          self.usersRef.child(self.getLoggedInUser().uid).once('value')
            .then((userRef) => {
              observer.next(userRef);
            }).catch((error) => {
              observer.error();
            });
        }
        else {
          observer.error();
        }
      });
  }
}

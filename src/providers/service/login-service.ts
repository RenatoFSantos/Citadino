import { SqLiteService } from './../database/sqlite-service';
import { UsuarioVO } from './../../model/usuarioVO';
import { UserCredentials } from './../../shared/interfaces';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {

  private usersRef: any;

  constructor(private fbService: FirebaseService,
    private sqService: SqLiteService) {
    this.usersRef = fbService.getDataBase().ref('/usuario');
  }

  //Retorna Ref de storage
  getStorageRef() {
    return this.fbService.getStorageRef();
  }

  onAuthStateChanged(callback) {
    return this.fbService.getFireBase().auth().onAuthStateChanged(callback);
  }

  //Retorna Usuario Autenticado
  getLoggedInUser() {
    return this.fbService.getFireBase().auth().currentUser;
  }

  //Login de Usuário Firebase
  signInUserFB(email: string, password: string) {
    let self = this;
    return self.fbService.getFireBase().auth().signInWithEmailAndPassword(email, password);
  }

  //Login de Usuário SqLite
  signInUserSQ(email: string, password: string) {
     let query: string = "SELECT usua_id, usua_uid_authentic, usua_nm_usuario,";
    query = query + "usua_ds_email, usua_tx_senha ";
    query = query + "from Usuario ";
    query = query + "WHERE usua_ds_email = ? ";
    query = query + "and usua_tx_senha = ? ";

    return this.sqService.pesquisar(query, [email, password]);
  }

  //Desconecta usuário Logado
  signOut() {
    return this.fbService.getFireBase().auth().signOut();
  }

  //Cria autenticação do usuário
  registerUser(user: UserCredentials) {
    return this.fbService.getFireBase().auth().createUserWithEmailAndPassword(user.email, user.password);
  }

  addUserFB(user: UsuarioVO, uid: string) {
    this.usersRef.child(uid).update({
      usua_nm_usuario: user.usua_nm_usuario,
      usua_ds_email: user.usua_ds_email,
      usua_tx_senha: user.usua_tx_senha
    });
  }

  addUserSQ(user: UsuarioVO, uid: string) {
    let self = this;
    let query: string = "INSERT INTO Usuario (";
    query = query + "usua_uid_authentic,usua_nm_usuario,";
    query = query + "usua_ds_email,usua_tx_senha) ";
    query = query + "Values (?,?, ?, ?)";

    self.sqService.inserir(query, [uid, user.usua_nm_usuario, user.usua_ds_email, user.usua_tx_senha]).then(
      (data) => {
        console.log("Usuario incluído com sucesso");
        return true;
      }, (err) => {
        console.error('Error ao inserir o usuário: ', err);
        throw 'Error ao inserir o usuário: ' + err.message;
      });
  }

  setUserImage(uid: string, urlProfile) {
    this.usersRef.child(uid).update({
      usua_ds_url_profile: urlProfile,
      image: true
    });
  }

  // getUserDetail(): any {
  //   let self = this;
  //   return Observable.create(
  //     observer => {
  //       if (self.getLoggedInUser() != null) {
  //         self.usersRef.child(self.getLoggedInUser().uid).once('value')
  //           .then((userRef) => {
  //             observer.next(userRef);
  //           }).catch((error) => {
  //             observer.error();
  //           });
  //       }
  //       else {
  //         observer.error();
  //       }
  //     });
  // }

  public getUserDetail(uid:string) {
     return this.usersRef.child(uid).once('value');
  }
}

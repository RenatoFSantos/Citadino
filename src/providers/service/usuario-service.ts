import { MappingsService } from './_mappings-service';
import { SqLiteService } from './../database/sqlite-service';
import { UsuarioVO } from './../../model/usuarioVO';
import { UserCredentials } from './../../shared/interfaces';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class UsuarioService {

  private usersRef: any;

  constructor(private fbService: FirebaseService,
              private sqService: SqLiteService,
              private mapSrv:MappingsService) {
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
    let query: string = "SELECT usua_id, usua_sq_id, usua_nm_usuario,";
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

  addUserFB(user: UsuarioVO) {
    let userJson = this.mapSrv.getUserJson(user);
    this.usersRef.child(user.usua_sq_id).update(userJson);
  }

  addUserSQ(user: UsuarioVO, uid: string) {
    let self = this;
    let query: string = "INSERT INTO Usuario (";
    query = query + "usua_sq_id,usua_nm_usuario,";
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
      usua_tx_urlprofile: urlProfile,
      image: true
    });
  }


  public getUsersRef() {
    return this.usersRef;
  }

  public getUserDetail(uid: string): any {
    return this.usersRef.child(uid).once('value');
  }

  public getEmpresaPorUsuario(usuarioKey:string) {
      return this.usersRef.child(usuarioKey).child("empresa")
      .orderByChild("empr_nm_razaosocial").once("value");
  }

 public getMensagens() {
    let userCurrent = this.getLoggedInUser();
    return this.usersRef.child(userCurrent.uid).child("mensagem").once("value");
  }

}

import { UsuarioSqlService } from './../database/usuario-sql-service';
import { MappingsService } from './_mappings-service';
import { UsuarioVO } from './../../model/usuarioVO';
import { UserCredentials } from './../../shared/interfaces';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class UsuarioService {
  private usersRef: any;

  constructor(private fbService: FirebaseService,
    private usuSqSrv: UsuarioSqlService,
    private mapSrv: MappingsService) {
    this.usersRef = fbService.getDataBase().ref('/usuario');
  }

  //Retorna Ref de storage
  getStorageRef() {
    return this.fbService.getStorageRef();
  }

  //Retorna storage
  getStorage() {
    return this.fbService.getStorage();
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



  //Desconecta usuário Logado
  signOut() {
    this.deletarUsuarioLogadoSq();
    return this.fbService.getFireBase().auth().signOut();
  }

  //Cria autenticação do usuário
  registerUser(user: UserCredentials) {
    return this.fbService.getFireBase().auth().createUserWithEmailAndPassword(user.email, user.password);
  }

  addUserFB(user: UsuarioVO) {
    let userJson = this.mapSrv.getUserJson(user);
    return this.usersRef.child(user.usua_sq_id).update(userJson);
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

  public getEmpresaPorUsuario(usuarioKey: string) {
    return this.usersRef.child(usuarioKey).child("empresa")
      .orderByChild("empr_nm_razaosocial").once("value");
  }

  public getMensagens() {
    let userCurrent = this.getLoggedInUser();
    return this.usersRef.child(userCurrent.uid).child("mensagem").once("value");
  }

  public saveToken(uid: string, token: string) {

    this.usersRef.child(uid).child('tokendevice').child(token).set(true);

  }

  public removeToken(uid: string, token: string) {

    this.usersRef.child(uid).child('tokendevice').child(token).set(null);

  }

  public getTokens(uid: string) {
    return this.usersRef.child(uid).child('tokendevice').once('value');
  }

  addUserSQ(user: UsuarioVO, uid: string) {
    let self = this;
    let result: number = null;

    var promise = new Promise(function (resolve, reject) {

      let query: string = "INSERT INTO usuario (";
      query = query + "usua_sq_id,usua_nm_usuario,";
      query = query + "usua_ds_email,usua_tx_senha, ";
      query = query + "usua_in_ajuda,usua_ds_telefone, ";
      query = query + "usua_tx_urlprofile ) ";
      query = query + "Values (?, ?, ?, ?, ?, ?, ? )";

      self.usuSqSrv.inserir(query, [uid, user.usua_nm_usuario, user.usua_ds_email,
        user.usua_tx_senha, user.usua_in_ajuda, user.usua_ds_telefone, ""]).then((data) => {

          if (data.rowsAffected > 0) {
            result = data.insertId;
          }

          resolve(result);

        }).catch((error) => {
          reject(error);

        });
    });

    return promise;
  }

  //Login de Usuário SqLite
  public pesquisarUsarioByEmailSenhaSql(email: string, password: string) {
    let query: string = "SELECT usua_id, usua_sq_id, usua_nm_usuario,";
    query = query + "usua_ds_email, usua_tx_senha, usua_in_ajuda, usua_ds_telefone, usua_tx_urlprofile ";
    query = query + "from usuario ";
    query = query + "WHERE usua_ds_email = ? ";
    query = query + "and usua_tx_senha = ? ";

    return this.usuSqSrv.pesquisar(query, [email, password]);
  }

  public pesquisarUsarioSqById(id: number) {
    return this.pesquisaUsuarioSQ(id, null);
  }

  public pesquisarUsarioSqByUid(uid: string) {
    return this.pesquisaUsuarioSQ(null, uid);
  }

  private pesquisaUsuarioSQ(idSq: number, idFirebase: string) {
    let self = this;
    let usuario: UsuarioVO = null;
    let param: any;

    var promise = new Promise(function (resolve, reject) {

      let query: string = "SELECT usua_id, usua_sq_id, usua_nm_usuario,";
      query = query + "usua_ds_email, usua_tx_senha, usua_in_ajuda, usua_ds_telefone, usua_tx_urlprofile ";
      query = query + "from usuario ";

      if (idSq != null) {
        query = query + "WHERE usua_id = ? ";
        param = idSq;
      }
      else if (idFirebase != null) {

        query = query + "WHERE usua_sq_id = ? ";
        param = idFirebase;
      }

      self.usuSqSrv.pesquisar(query, [param]).then((result) => {

        if (result.rows.length > 0) {
          usuario = new UsuarioVO();
          usuario.usua_id = result.rows.item(0).usua_id;
          usuario.usua_sq_id = result.rows.item(0).usua_sq_id;
          usuario.usua_nm_usuario = result.rows.item(0).usua_nm_usuario;
          usuario.usua_ds_email = result.rows.item(0).usua_ds_email;
          usuario.usua_tx_senha = result.rows.item(0).usua_tx_senha;
          if (result.rows.item(0).usua_in_ajuda == "true"
            || result.rows.item(0).usua_in_ajuda == true) {
            usuario.usua_in_ajuda = true;
          }
          else {
            usuario.usua_in_ajuda = false;
          }
          usuario.usua_ds_telefone = result.rows.item(0).usua_ds_telefone;
          usuario.usua_tx_urlprofile = result.rows.item(0).usua_tx_urlprofile;

          resolve(usuario);
        }
        else {
          resolve(null);
        }
      }).catch((error) => {
        reject(error);
      })
    });

    return promise;
  }


  public pesquisaUsuarioLogadoSq() {
    let self = this;
    let usua: UsuarioVO = null;

    var promise = new Promise(function (resolve, reject) {

      var query = "select usua_id from usuario_logado ";
      self.usuSqSrv.pesquisar(query, {}).then((result) => {
        if (result.rows.length > 0) {
          usua = new UsuarioVO();
          usua.usua_id = result.rows.item(0).usua_id;
          resolve(usua);
        } else {
          resolve(usua);
        }
      }).catch((error) => {
        reject(error);
      });
    });

    return promise;
  }

  public atualizaUsuarioLogadoSq(id: number) {
    var query = "UPDATE usuario_logado ";
    query = query + "SET usua_id = ? ";

    this.usuSqSrv.atualizar(query, [id]).then((result) => {

      console.log(result);

      if (result == null) {

      }
    }).catch((error) => {
      throw new Error(error);
    });

  }

  public deletarUsuarioLogadoSq() {
    var query = "DELETE FROM usuario_logado";
    this.usuSqSrv.atualizar(query, []).then((result) => {
      console.log("Deletado");
    });
  }

  public inseritUsuarioLogadoSq(id: number) {

    var query = "INSERT INTO usuario_logado ( usua_id ) Values ( ? ) ";

    this.usuSqSrv.inserir(query, [id]).then((result) => {

      console.log(result);

    }).catch((error) => {
      throw new Error(error);
    });

  }
}

// import { Promise } from 'firebase/app';
// import { MappingsService } from './_mappings-service';
// import { MunicipioVO } from './../../model/municipioVO';
// import { UsuarioSqlService } from './../database/usuario-sql-service';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class MunicipioService {

  private municipioRef: any;

  constructor(private fbService: FirebaseService) {

    this.municipioRef = fbService.getDataBase().ref("/municipio");

  }

  getMunicipioRef() {
    return this.municipioRef;
  }

  findMunicipioById(uid: string) {
    return this.municipioRef.child(uid).once('value');
  }

  listMunicipio() {
    return this.municipioRef.orderByChild('muni_nm_municipio').once('value');
  }

}


// private municipioRef: any;
// private municipios: Array<MunicipioVO> = null;

// constructor(private muniSqlSrv: UsuarioSqlService,
//   private mapSrv: MappingsService) {

//   var self = this;

//   this.pesquisaMunicipios().then((result: any) => {
//     if (result.municipios != null) {
//       self.municipios = result.municipios;
//     }
//     else {

//     }
//   })


// }

// getMunicipioRef() {
//   return this.municipioRef;
// }

// findMunicipioById(uid: string) {
//   return this.municipioRef.child(uid).once('value');
// }

// listMunicipio(): Array<MunicipioVO> {
//   var self
//   var result: Array<MunicipioVO> = new Array<MunicipioVO>();

//   this.pesquisaMunicipios()
//     .then((munic: any) => {
//       result = munic.municipios;
//     })
//     .catch((error) => {
//       return null;
//     });

//   return result;
// }

// private pesquisaMunicipios = function () {
//   var self = this;
//   var query = "select * from municipio order by muni_nm_municipio";
//   var municipios: Array<MunicipioVO> = null;

//   var promise = new Promise(function (resolve, reject) {

//     self.muniSqlSrv.listarTodos(query)
//       .then((result: any) => {
//         if (result != null && result.lenght > 0) {
//           municipios = new Array<MunicipioVO>();
//           result.forEach(item => {
//             municipios.push(self.mapSrv.getMunicipio(item));
//           });
//           resolve({ self, municipios });
//         }
//         else {
//           resolve({ self, municipios });
//         }
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });

//   return promise;
// }

// private inserirMunicipio = function (params) {
//   var self = params.self;
//   var municipios: Array<MunicipioVO> = new Array<MunicipioVO>();

//   var muniBicas: MunicipioVO = new MunicipioVO();
//   muniBicas.muni_sq_id = "-KoJyCiR1SOOUrRGimAS";
//   muniBicas.muni_nm_municipio = "Bicas";
//   municipios.push(muniBicas);

//   var muniMarEspanha: MunicipioVO = new MunicipioVO();
//   muniMarEspanha.muni_sq_id = "-L216ocQUdumtDf7otez";
//   muniMarEspanha.muni_nm_municipio = "Mar de Espanha";
//   municipios.push(muniMarEspanha);

//   var promise = new Promise(function (resolve, reject) {

//     municipios.forEach(munic => {
//       let query: string = "INSERT INTO municipio (";
//       query = query + "muni_sq_id,muni_nm_municipio) ";
//       query = query + "Values (?, ?)";

//       self.muniSqlSrv.inserir(query, [
//         munic.muni_sq_id, munic.muni_nm_municipio]);
//     });

//   })

//   return promise;

// }
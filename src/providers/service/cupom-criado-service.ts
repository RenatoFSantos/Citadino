import { CupomCriadoVO } from './../../model/cupomCriadoVO';
import { CupomVO } from './../../model/cupomVO';
import { MappingsService } from './_mappings-service';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class CupomCriadoService {

  private cupomCriadoRef: any;

  constructor(private fbService: FirebaseService,
    private mapSrv: MappingsService) {
    this.cupomCriadoRef = this.fbService.getDataBase().ref('cupomcriado');
  }

    //Retorna Ref de storage
    public getStorageRef() {
      return this.fbService.getStorageRef();
    }
  
    //Retorna storage
    public getStorage() {
      return this.fbService.getStorage();
    }

  public getDataBaseRef() {
    return this.fbService.getDataBase().ref();
  }

  public getCupomRef() {
    return this.cupomCriadoRef;
  }

  public salvar(uidUsuario: string, uidCupom: string, cupom: CupomCriadoVO) {
    return this.cupomCriadoRef.child(uidUsuario).child(uidCupom).set(cupom);
  }

  public excluir(uidUsuario: string, uidCupom: string) {
    return this.cupomCriadoRef.child(uidUsuario).child(uidCupom).set(null);
  }

  public pesquisarCupomPorId(usuariokey: string, cupomKey: string) {
    return this.cupomCriadoRef.child(usuariokey).child(cupomKey).once("value");
  }

  public getNewUidCpom(usuarioKey: string): string {
    var newKey = this.cupomCriadoRef.child(usuarioKey).push().key
    return newKey;
  }

  public getPromocoesPorUsuario(uidUsuario: string) {
    return this.cupomCriadoRef.child(uidUsuario).orderByChild('cupo_sq_ordem').once("value");
  }

  public baixarCupomTransacion(usuariokey:string, cupomKey:String) {
    return this.getCupomRef().child(usuariokey).child(cupomKey).child("cupo_nr_qtdedisponivel");
  }

}

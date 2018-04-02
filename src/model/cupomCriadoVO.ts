import { CupomUsuarioDTO } from './dominio/cupomUsuarioDTO';
import { CupomCriadoItemVO } from './cupomCriadoItemVO';
import { CupomVO } from './cupomVO';
export class CupomCriadoVO extends CupomVO {
  public usuario: CupomUsuarioDTO = new CupomUsuarioDTO();
  public cupomItens:Array<CupomCriadoItemVO> = null;
}
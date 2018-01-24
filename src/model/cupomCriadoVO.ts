import { UsuarioCupomDTO } from './dominio/usuarioCupomDTO';
import { CupomVO } from './cupomVO';
export class CupomCriadoVO extends CupomVO {
  public usuario: UsuarioCupomDTO = new UsuarioCupomDTO();
}
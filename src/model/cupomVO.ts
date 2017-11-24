import { CupomEmpresaVO } from './cupomEmpresaVO';
import { TipoCupomVO } from "./tipoCupomVO";

export class CupomVO {
    public cupo_sq_id:string;
    public cupo_tx_desconto:string = "";
    public cupo_tx_urlimagem:string = "";
    public cupo_tx_regulamento:string = "";
    public cupo_tx_titulo:string = "";
    public cupo_tx_descricao:string = "";
    public cupo_nr_vlatual:number = 0;
    public cupo_nr_vlcomdesconto:number = 0;
    public cupo_dt_validade:Date;
    public tipoCupom:TipoCupomVO;
    public cupoEmpresa:CupomEmpresaVO;
    public cupo_nr_qtdecupom;
    public cupo_nr_qtdedisponivel;
}
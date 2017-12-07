import { CupomEmpresaVO } from './cupomEmpresaVO';

export class CupomVO {
    public cupo_sq_id: string;
    public cupo_tx_titulo: string = "";
    public cupo_tx_descricao: string = "";
    public cupo_tx_regulamento: string = "";
    public cupo_dt_validade: Date;
    public cupo_nr_desconto:number = 0;
    public cupo_tx_urlimagem: string = "";
    public cupo_nr_vlatual: number = 0;
    public cupo_nr_vlcomdesconto: number = 0;
    public tipoCupom: number;
    public cupoEmpresa: CupomEmpresaVO;
    public cupo_nr_qtdecupom = 0;
    public cupo_nr_qtdedisponivel = 0;
    public cupo_in_status:boolean = true;
}
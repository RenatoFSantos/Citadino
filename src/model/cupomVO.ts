import { CupomEmpresaDTO } from './dominio/cupomEmpresaDTO';

export class CupomVO {
    public cupo_id: number = null;
    public cupo_sq_id: string;
    public cupo_tx_titulo: string = "";
    public cupo_tx_descricao: string = "";
    public cupo_tx_regulamento: string = "";
    public cupo_dt_cadastro: Date;
    public cupo_dt_validade: Date;
    public cupo_nr_desconto: number = null;
    public cupo_tx_urlimagem: string = "";
    public cupo_nr_vlatual: number = null;
    public cupo_nr_vlcomdesconto: number = null;
    //1=Desconto 2=Sorteio
    public tipoCupom: number = 1;
    public empresa: CupomEmpresaDTO = new CupomEmpresaDTO();
    public cupo_nr_qtdecupom: number = null;
    public cupo_nr_qtdedisponivel: number = null;
    //True=Ativo False=Inativo
    public cupo_in_status: boolean = true;
    public cupo_sq_ordem: string = ""; // novo
    public vitr_sq_id: string = "";
    public cupo_dt_publicado:Date;
    public tipo_tx_anuncio:string = "";    
    public sort_sq_id:string = "";

    
}
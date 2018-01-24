import { MunicipioVO } from './../municipioVO';
export class CupomEmpresaDTO {
    public empr_sq_id:string
    public empr_nm_fantasia:string;
    public empr_tx_endereco: string;
    public empr_tx_bairro: string;
    public empr_tx_cidade: string;
    public empr_tx_telefone_1: string;
    public empr_nr_documento: string;
    public municipio:MunicipioVO = new MunicipioVO() ;
}
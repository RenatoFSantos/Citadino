import { PlanoVO } from './planoVO';
import { CategoriaVO } from './categoriaVO';
export class EmpresaVO {

    public empr_sq_id: string;
    public empr_nm_razaosocial: string;
    public empr_nm_fantasia: string;
    public empr_tx_endereco: string;
    public empr_tx_bairro: string;
    public empr_tx_cidade: string;
    public empr_sg_uf: string;
    public empr_nr_cep: string;
    public empr_nr_credito: number;
    public empr_tx_logomarca: string;
    public empr_tx_telefone_1: string;
    public empr_tx_telefone_2: string;
    public empr_nm_contato: string;
    public empr_sg_pessoa:string;
    public empr_nr_documento: string;
    public empr_nr_inscestadual: string;
    public empr_nr_inscmunicipal: string;
    public empr_tx_googlemaps: string;
    public empr_ds_email: string;
    public empr_ds_site: string;
    public empr_tx_sobre: string;
    public empr_tx_observacao: string;
    public empr_nr_reputacao: number;
    public empr_in_mensagem: boolean;
    public empr_in_parceiro:boolean;
    public empr_tx_subcategoria:string;
    public categoria: CategoriaVO;
    public plano: PlanoVO;
    public isIndexNome:boolean; 

    constructor() {
        this.empr_sq_id = '';
        this.empr_nm_razaosocial= '';
        this.empr_nm_fantasia= '';
        this.empr_tx_endereco= '';
        this.empr_tx_bairro= '';
        this.empr_tx_cidade= '';
        this.empr_sg_uf= '';
        this.empr_nr_cep= '';
        this.empr_nr_credito = 0;
        this.empr_tx_logomarca= '';
        this.empr_tx_telefone_1= '';
        this.empr_tx_telefone_2= '';
        this.empr_nm_contato= '';
        this.empr_ds_email='';
        this.empr_ds_site='';
        this.empr_sg_pessoa='';
        this.empr_nr_documento= '';
        this.empr_nr_inscestadual= '';
        this.empr_nr_inscmunicipal= '';
        this.empr_tx_googlemaps= '';
        this.empr_tx_sobre= '';
        this.empr_tx_observacao= '';
        this.empr_nr_reputacao= 0;
        this.empr_in_mensagem = true;
        this.empr_in_parceiro = false;
        this.empr_tx_subcategoria = '';
        this.categoria = new CategoriaVO();
        this.plano = new PlanoVO();
        this.isIndexNome = false; 
    }
}
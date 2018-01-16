export class VitrineVO {
    public vitr_sq_id: string = "";
    public vitr_dt_agendada: string = "";
    public vitr_sq_ordem:string = ""; // novo
    public anun_sq_id: string = "";
    public anun_ds_anuncio: string = "";
    public anun_tx_titulo: string = "";
    public anun_tx_subtitulo: string = "";
    public anun_tx_texto: string = "";
    public anun_tx_urlavatar: string = "";
    public anun_tx_urlthumbnail: string = "";
    public anun_tx_urlbanner: string = "";
    public anun_tx_urlicone: string = "";
    public anun_tx_urlslide1: string = "";
    public anun_tx_urlslide2: string = "";
    public anun_tx_urlslide3: string = "";
    public anun_tx_urlslide4: string = "";
    public anun_nr_curtidas: number = 0;
    public anun_nr_salvos: number = 0;
    public anun_nr_visitas: number = 0;
    public anun_in_status: string = "";
    public empr_sq_id: string = "";
    public empr_nm_fantasia:string = ""; // novo
    public empr_tx_endereco: string; //ENDERECO CUPOM
    public empr_tx_bairro: string; //BAIRRO CUPOM
    public empr_tx_cidade: string; //CIDADE CUPOM
    public empr_tx_telefone_1: string; //TELEFONE CUPOM
    public muni_sq_id: string = "";
    public tian_sq_id: string = "";
    public agen_sq_id: string = "";
    public anun_in_smartsite:boolean = false;   
    public vitr_in_buttonmore:boolean = false; // Campo de controle para tamanho do texto
    public usua_sq_id:string = ""; // novo   
    public anun_nr_imagens:string = ""; //novo 
    public anun_in_curtida:boolean = false; //novo
    public cupo_sq_id:string = ""; //ID CUPOM
    public cupo_nr_desconto:number = 0; //VALOR DESCONTO
    public cupo_nr_vlatual:number = 0; //VALOR PRODUTO
    public tpcu_sq_id:number = null; //TIPO CUPOM 1 DESCONTO 2 SORTEIO 
    public cupo_nnr_qtdecupom:number = 0; //QTDE DE CUPONS
    public cupo_nr_qtdedisponivel:number = 0; //QTDE DISPONIVEL
    public cupo_in_status:boolean = true; //STATUS DO CUPOM ATIVO / INATIVO 
    public cupo_dt_validade:Date; //VALIDADE DO CUPOM
    public cupo_nr_vlcomdesconto:number = 0; //VALOR COM DESCONTO

}

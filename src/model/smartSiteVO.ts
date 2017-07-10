import { EmpresaVO } from './empresaVO';


export class SmartsiteVO {
    public smar_sq_id: string;
    public smar_tx_titulo: string;
    public smar_tx_subtitulo: string;
    public smar_tx_conteudo: string;
    public smar_in_preco: boolean;
    public smar_tx_imagem1: string;
    public empresa: EmpresaVO;

    constructor() {
        this.smar_sq_id = '';
        this.smar_tx_titulo= '';
        this.smar_tx_subtitulo = '';
        this.smar_tx_conteudo = '';
        this.smar_in_preco = false;
        this.smar_tx_imagem1 = '';
        this.empresa = new EmpresaVO();
    }

}
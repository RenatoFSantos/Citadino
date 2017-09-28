import { CtdFuncoes } from './../shared/ctdFuncoes';
import * as enums from './../model/dominio/ctdEnum';
import { EmpresaVO } from './empresaVO';

export class UsuarioVO {
    public usua_id:number;
    public usua_sq_id: string;
    // public usua_uid_authentic: string;
    public usua_nm_usuario: string;
    public usua_tx_login: string;
    public usua_tx_senha: string;
    public usua_ds_sexo: string;
    public usua_dt_inclusao: string;
    public usua_ds_telefone: string;
    public usua_ds_email: string;
    public usua_nr_reputacao: number;
    public usua_tx_observacao: string;
    public usua_in_empresa: boolean;
    public usua_tx_urlprofile: string;
    public usua_in_ajuda:boolean;
    public empresa: EmpresaVO;
    public usua_sg_perfil:string; //USU USUARIO  ADM ADMINISTRADOR //PAR PARCEIRO /COL COLUNISTA

 
    constructor() {
        this.usua_sq_id = '';
        // this.usua_uid_authentic = '';
        this.usua_nm_usuario = '';
        this.usua_tx_login = '';
        this.usua_tx_senha = '';
        this.usua_ds_sexo = '';
        this.usua_dt_inclusao = CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.enUS);
        this.usua_ds_telefone = '';
        this.usua_ds_email = '';
        this.usua_nr_reputacao = 0;
        this.usua_tx_observacao = '';
        this.usua_in_empresa = false;
        this.usua_in_ajuda = false;
        this.empresa = new EmpresaVO();
        this.usua_sg_perfil = '';      
    }
}
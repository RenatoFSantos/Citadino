export class PlanoVO {
    public plan_sq_id: string;
    public plan_nm_plano: string;
    public plan_ds_descricao: string;
    public plan_vl_plano: number;
    public plan_tp_valor: string;
    public plan_in_smartsite: boolean;
    public plan_in_tabpreco: boolean;
    public plan_in_ecommerce: boolean;

    constructor() {
        this.plan_sq_id = '';
        this.plan_nm_plano= '';
        this.plan_ds_descricao= '';
        this.plan_vl_plano= 0;
        this.plan_tp_valor= '';
        this.plan_in_smartsite = false;
        this.plan_in_tabpreco = false;
        this.plan_in_ecommerce = false;
    }

}
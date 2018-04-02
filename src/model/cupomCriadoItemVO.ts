import { CupomEmpresaDTO } from './dominio/cupomEmpresaDTO';
export class CupomCriadoItemVO {
    public id:number = null;
    public cupo_sq_id: string;
    public cupo_nr_cupom: string;   
    public cupo_in_status: boolean = true;
    public empresa: CupomEmpresaDTO = new CupomEmpresaDTO();
}
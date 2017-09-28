import { EmpresaVO } from './../../model/empresaVO';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { UsuarioVO } from './../../model/usuarioVO';
import { VitrineVO } from './../../model/vitrineVO';
import * as enums from './../../model/dominio/ctdEnum';
import { Injectable } from '@angular/core';

@Injectable()
export class MappingsService {

    constructor() { }

    getVitrines(snapshot: any): Array<VitrineVO> {
        let vitrines: Array<VitrineVO> = [];
        if (snapshot.val() == null)
            return vitrines;

        let list = snapshot.val();

        Object.keys(snapshot.val()).map((key: any) => {
            let vitrine: any = list[key];
            vitrines.push({
                vitr_sq_id: key,
                vitr_dt_agendada: vitrine.vitr_dt_agendada,
                anun_sq_id: vitrine.anun_sq_id,
                anun_ds_anuncio: vitrine.anun_ds_anuncio,
                anun_tx_titulo: vitrine.anun_tx_titulo,
                anun_tx_subtitulo: vitrine.anun_tx_subtitulo,
                anun_tx_texto: vitrine.anun_tx_texto,
                anun_tx_urlavatar: vitrine.anun_tx_urlavatar,
                anun_tx_urlthumbnail: vitrine.anun_tx_urlthumbnail,
                anun_tx_urlbanner: vitrine.anun_tx_urlbanner,
                anun_tx_urlicone: vitrine.anun_tx_urlicone,
                anun_tx_urlslide1: vitrine.anun_tx_urlslide1,
                anun_tx_urlslide2: vitrine.anun_tx_urlslide2,
                anun_tx_urlslide3: vitrine.anun_tx_urlslide3,
                anun_nr_curtidas: vitrine.anun_nr_curtidas,
                anun_nr_salvos: vitrine.anun_nr_salvos,
                anun_nr_visitas: vitrine.anun_nr_visitas,
                anun_in_status: vitrine.anun_in_status,
                empr_sq_id: vitrine.empr_sq_id,
                muni_sq_id: vitrine.muni_sq_id,
                tian_sq_id: vitrine.tian_sq_id,
                agen_sq_id: vitrine.agen_sq_id,
                anun_in_smartsite: vitrine.anun_in_smartsite
            });
        });

        return vitrines;
    }

    getVitrine(snapshot: any, key: string): VitrineVO {
        let vitrine: VitrineVO = {
            vitr_sq_id: key,
            vitr_dt_agendada: snapshot.vitr_dt_agendada,
            anun_sq_id: snapshot.anun_sq_id,
            anun_ds_anuncio: snapshot.anun_ds_anuncio,
            anun_tx_titulo: snapshot.anun_tx_titulo,
            anun_tx_subtitulo: snapshot.anun_tx_subtitulo,
            anun_tx_texto: snapshot.anun_tx_texto,
            anun_tx_urlavatar: snapshot.anun_tx_urlavatar,
            anun_tx_urlthumbnail: snapshot.anun_tx_urlthumbnail,
            anun_tx_urlbanner: snapshot.anun_tx_urlbanner,
            anun_tx_urlicone: snapshot.anun_tx_urlicone,
            anun_tx_urlslide1: snapshot.anun_tx_urlslide1,
            anun_tx_urlslide2: snapshot.anun_tx_urlslide2,
            anun_tx_urlslide3: snapshot.anun_tx_urlslide3,
            anun_nr_curtidas: snapshot.anun_nr_curtidas,
            anun_nr_salvos: snapshot.anun_nr_salvos,
            anun_nr_visitas: snapshot.anun_nr_visitas,
            anun_in_status: snapshot.anun_in_status,
            empr_sq_id: snapshot.empr_sq_id,
            muni_sq_id: snapshot.muni_sq_id,
            tian_sq_id: snapshot.tian_sq_id,
            agen_sq_id: snapshot.agen_sq_id,
            anun_in_smartsite: snapshot.anun_in_smartsite
        };

        return vitrine;
    }

    getUserJson(user: UsuarioVO): string {
        let json: any =
            {
                usua_sq_id: user.usua_sq_id,
                usua_nm_usuario: user.usua_nm_usuario,
                usua_tx_login: user.usua_tx_login,
                usua_tx_senha: user.usua_tx_senha,
                usua_ds_sexo: '',
                usua_dt_inclusao: CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.enUS),
                usua_ds_telefone: '',
                usua_ds_email: '',
                usua_nr_reputacao: 0,
                usua_tx_observacao: '',
                usua_in_empresa: false,
                usua_in_ajuda: false,
                usua_tx_urlprofile: user.usua_tx_urlprofile,
                usua_sg_perfil: user.usua_sg_perfil
            }

        return json;
    }


    getUsuario(snapshot: any): UsuarioVO {

        let usuario: UsuarioVO = {
            usua_id: 0,
            usua_sq_id: snapshot.val().usua_sq_id,
            usua_nm_usuario: snapshot.val().usua_nm_usuario,
            usua_tx_login: snapshot.val().usua_tx_login,
            usua_tx_senha: snapshot.val().usua_tx_senha,
            usua_ds_sexo: snapshot.val().usua_ds_sexo,
            usua_dt_inclusao: snapshot.val().usua_dt_inclusao,
            usua_ds_telefone: snapshot.val().usua_ds_telefone,
            usua_ds_email: snapshot.val().usua_ds_email,
            usua_nr_reputacao: snapshot.val().usua_nr_reputacao,
            usua_tx_observacao: snapshot.val().usua_tx_observacao,
            usua_in_empresa: snapshot.val().usua_in_empresa,
            usua_in_ajuda: snapshot.val().usua_in_ajuda,
            usua_tx_urlprofile: snapshot.val().usua_tx_urlprofile,
            usua_sg_perfil: snapshot.val().usua_sg_perfil,
            empresa: this.getUsuarioEmpresa(snapshot)           
            
        };

        return usuario;
    }


    getUsuarioEmpresa(snapUsuaEmpr: any ): EmpresaVO {

        if (snapUsuaEmpr.child('empresa').exists()) {

            var objEmpresaVal:any = Object.keys(snapUsuaEmpr.child('empresa').val())
            var empr:any = snapUsuaEmpr.child('empresa').val()[objEmpresaVal];

            let empresa: EmpresaVO = {
                empr_sq_id : empr.empr_sq_id,
                empr_nm_razaosocial: empr.empr_nm_razaosocial,
                empr_nm_fantasia: '',
                empr_tx_endereco: '',
                empr_tx_bairro: '',
                empr_tx_cidade: '',
                empr_sg_uf: '',
                empr_nr_cep: '',
                empr_nr_credito : 0,
                empr_tx_logomarca: '',
                empr_tx_telefone_1: '',
                empr_tx_telefone_2: '',
                empr_nm_contato: '',
                empr_ds_email:'',
                empr_ds_site:'',
                empr_sg_pessoa:'',
                empr_nr_documento: '',
                empr_nr_inscestadual: '',
                empr_nr_inscmunicipal: '',
                empr_tx_googlemaps: '',
                empr_tx_sobre: '',
                empr_tx_observacao: '',
                empr_nr_reputacao: 0,
                empr_in_mensagem : true,
                empr_in_parceiro : false,
                empr_tx_subcategoria : '',
                categoria : null,
                plano : null,
                isIndexNome : false 
            }

            return empresa;
        }
        else {
            return null;
        }
    }
}
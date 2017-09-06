import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { UsuarioVO } from './../../model/usuarioVO';
import { VitrineVO } from './../../model/vitrineVO';
import * as enums from './../../model/dominio/ctdEnum';
import { Injectable } from '@angular/core';

@Injectable()
export class MappingsService {

    constructor() {}

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
                anun_in_smartsite:snapshot.anun_in_smartsite
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
                usua_tx_urlprofile: user.usua_tx_urlprofile             
            }

        return json;
    }


}
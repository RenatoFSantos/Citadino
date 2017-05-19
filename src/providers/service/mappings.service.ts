import { ItemsService } from './items.service';
import { VitrineVO } from './../../model/vitrineVO';
import { Injectable } from '@angular/core';

@Injectable()
export class MappingsService {

    constructor(private itemsService: ItemsService) { }

    getThreads(snapshot: any): Array<VitrineVO> {
        let vitrines: Array<VitrineVO> = [];
        if (snapshot.val() == null)
            return vitrines;

        let list = snapshot.val();

        Object.keys(snapshot.val()).map((key: any) => {
            let vitrine: any = list[key];
            vitrines.push({
                agen_sq_agenda: key,
                agen_dt_agendada: vitrine.agen_dt_agendada,
                anun_sq_anuncio: vitrine.anun_sq_anuncio,
                anun_nr_curtidas: vitrine.anun_nr_curtidas,
                anun_nr_salvos: vitrine.anun_nr_salvos,
                anun_nr_visitas: vitrine.anun_nr_visitas,
                anun_tx_subtitulo: vitrine.anun_tx_subtitulo,
                anun_tx_texto: vitrine.anun_tx_texto,
                anun_tx_titulo: vitrine.anun_tx_titulo,
                anun_tx_urlavatar: vitrine.anun_tx_urlavatar,
                anun_tx_urlbanner: vitrine.anun_tx_urlbanner,
                anun_tx_urlicon: vitrine.anun_tx_urlicon,
                anun_tx_urlslide1: vitrine.anun_tx_urlslide1,
                anun_tx_urlslide2: vitrine.anun_tx_urlslide2,
                anun_tx_urlslide3: vitrine.anun_tx_urlslide3,
                anun_tx_urlthumbnail: vitrine.anun_tx_urlthumbnail,
                empr_sq_cidade: vitrine.empr_sq_cidade,
                empr_sq_empresa: vitrine.empr_sq_empresa,
                tian_sq_tipoanuncio: vitrine.tian_sq_tipoanuncio
            });
        });

        return vitrines;
    }

    getThread(snapshot: any, key: string): VitrineVO {
        console.log("anun_sq_anuncio " + snapshot.anun_sq_anuncio);
        let vitrine: VitrineVO = {
            agen_sq_agenda: key,
            agen_dt_agendada: snapshot.agen_dt_agendada,
            anun_sq_anuncio: snapshot.anun_sq_anuncio,
            anun_nr_curtidas: snapshot.anun_nr_curtidas,
            anun_nr_salvos: snapshot.anun_nr_salvos,
            anun_nr_visitas: snapshot.anun_nr_visitas,
            anun_tx_subtitulo: snapshot.anun_tx_subtitulo,
            anun_tx_texto: snapshot.anun_tx_texto,
            anun_tx_titulo: snapshot.anun_tx_titulo,
            anun_tx_urlavatar: snapshot.anun_tx_urlavatar,
            anun_tx_urlbanner: snapshot.anun_tx_urlbanner,
            anun_tx_urlicon: snapshot.anun_tx_urlicon,
            anun_tx_urlslide1: snapshot.anun_tx_urlslide1,
            anun_tx_urlslide2: snapshot.anun_tx_urlslide2,
            anun_tx_urlslide3: snapshot.anun_tx_urlslide3,
            anun_tx_urlthumbnail: snapshot.anun_tx_urlthumbnail,
            empr_sq_cidade: snapshot.empr_sq_cidade,
            empr_sq_empresa: snapshot.empr_sq_empresa,
            tian_sq_tipoanuncio: snapshot.tian_sq_tipoanuncio
        };

        return vitrine;
    }

}
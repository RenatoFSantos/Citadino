import { CupomUsuarioDTO } from './../../model/dominio/cupomUsuarioDTO';
import { CupomCriadoItemVO } from './../../model/cupomCriadoItemVO';
import { ItemsService } from './_items-service';
import { GlobalVar } from './../../shared/global-var';
import { CupomCriadoVO } from './../../model/cupomCriadoVO';
import { CupomEmpresaDTO } from './../../model/dominio/cupomEmpresaDTO';
import { MunicipioVO } from './../../model/municipioVO';
import { CupomVO } from './../../model/cupomVO';
import { EmpresaVO } from './../../model/empresaVO';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { UsuarioVO } from './../../model/usuarioVO';
import { VitrineVO } from './../../model/vitrineVO';
import * as enums from './../../model/dominio/ctdEnum';
import { Injectable } from '@angular/core';
import { CategoriaVO } from '../../model/categoriaVO';

@Injectable()
export class MappingsService {

    constructor(private glbVar: GlobalVar,
        private itenSrv: ItemsService) { }

    public getVitrines(snapshot: any): Array<VitrineVO> {
        let vitrines: Array<VitrineVO> = [];

        if (snapshot.val() != null) {

            snapshot.forEach(element => {

                var vitrine: VitrineVO = new VitrineVO();
                vitrine.vitr_sq_id = element.val().vitr_sq_id;
                vitrine.vitr_dt_agendada = element.val().vitr_dt_agendada;
                vitrine.vitr_sq_ordem = element.val().vitr_sq_ordem != undefined ? element.val().vitr_sq_ordem : "";
                vitrine.anun_sq_id = element.val().anun_sq_id;
                vitrine.anun_ds_anuncio = element.val().anun_ds_anuncio;
                vitrine.anun_tx_titulo = element.val().anun_tx_titulo;
                vitrine.anun_tx_subtitulo = element.val().anun_tx_subtitulo;
                vitrine.vitr_in_buttonmore = this.enableShowMore(element.val().anun_tx_texto != "" ? element.val().anun_tx_texto : ""); vitrine.anun_tx_texto = element.val().anun_tx_texto != "" && element.val().anun_tx_texto != null ? this.replaceLineBreakVitrine(element.val().anun_tx_texto) : "";
                vitrine.anun_tx_urlavatar = element.val().anun_tx_urlavatar;
                vitrine.anun_tx_urlthumbnail = element.val().anun_tx_urlthumbnail;
                vitrine.anun_tx_urlbanner = element.val().anun_tx_urlbanner;
                vitrine.anun_tx_urlicone = element.val().anun_tx_urlicone;
                vitrine.anun_tx_urlslide1 = element.val().anun_tx_urlslide1;
                vitrine.anun_tx_urlslide2 = element.val().anun_tx_urlslide2;
                vitrine.anun_tx_urlslide3 = element.val().anun_tx_urlslide3;
                vitrine.anun_tx_urlslide4 = element.val().anun_tx_urlslide4 != undefined ? element.val().anun_tx_urlslide4 : "";
                vitrine.anun_nr_curtidas = element.val().anun_nr_curtidas;
                vitrine.anun_nr_salvos = element.val().anun_nr_salvos;
                vitrine.anun_nr_visitas = element.val().anun_nr_visitas,
                    vitrine.anun_in_status = element.val().anun_in_status;
                vitrine.empr_sq_id = element.val().empr_sq_id;
                vitrine.empr_nm_fantasia = element.val().empr_nm_fantasia != undefined ? element.val().empr_nm_fantasia : "";
                vitrine.empr_tx_endereco = element.val().empr_tx_endereco != undefined ? element.val().empr_tx_endereco : "";
                vitrine.empr_tx_bairro = element.val().empr_tx_bairro != undefined ? element.val().empr_tx_bairro : "";
                vitrine.empr_tx_cidade = element.val().empr_tx_cidade != undefined ? element.val().empr_tx_cidade : "";
                vitrine.empr_tx_telefone_1 = element.val().empr_tx_telefone_1 != undefined ? element.val().empr_tx_telefone_1 : "";
                vitrine.empr_nr_documento = element.val().empr_nr_documento != undefined ? element.val().empr_nr_documento : "";
                vitrine.muni_sq_id = element.val().muni_sq_id;
                vitrine.tian_sq_id = element.val().tian_sq_id;
                vitrine.agen_sq_id = element.val().agen_sq_id;
                vitrine.anun_in_smartsite = element.val().anun_in_smartsite;
                vitrine.usua_sq_id = element.val().usua_sq_id != undefined ? element.val().usua_sq_id : "";
                vitrine.anun_nr_imagens = element.val().anun_nr_imagens != undefined ? element.val().anun_nr_imagens : "";
                vitrine.anun_in_curtida = element.val().anun_in_curtida != undefined ? element.val().anun_in_curtida : false;
                vitrine.cupo_sq_id = element.val().cupo_sq_id != undefined ? element.val().cupo_sq_id : false;
                vitrine.cupo_nr_desconto = element.val().cupo_nr_desconto != undefined ? element.val().cupo_nr_desconto : false;
                vitrine.cupo_nr_vlatual = element.val().cupo_nr_vlatual != undefined ? element.val().cupo_nr_vlatual : false;
                vitrine.tpcu_sq_id = element.val().tpcu_sq_id != undefined ? element.val().tpcu_sq_id : false;
                vitrine.cupo_nnr_qtdecupom = element.val().cupo_nnr_qtdecupom != undefined ? element.val().cupo_nnr_qtdecupom : false;
                vitrine.cupo_nr_qtdedisponivel = element.val().cupo_nr_qtdedisponivel != undefined ? element.val().cupo_nr_qtdedisponivel : false;
                vitrine.cupo_in_status = element.val().cupo_in_status != undefined ? element.val().cupo_in_status : false;
                vitrine.cupo_dt_validade = element.val().cupo_dt_validade != undefined ? element.val().cupo_dt_validade : false;
                vitrine.cupo_nr_vlcomdesconto = element.val().cupo_nr_vlcomdesconto != undefined ? element.val().cupo_nr_vlcomdesconto : false;

                vitrines.push(vitrine);
            });
        }

        return vitrines;
    };


    public getVitrine(snapshot: any, key: string): VitrineVO {
        let vitrine: VitrineVO = {
            vitr_sq_id: key,
            vitr_dt_agendada: snapshot.vitr_dt_agendada,
            vitr_sq_ordem: snapshot.vitr_sq_ordem != undefined ? snapshot.vitr_sq_ordem : "",
            anun_sq_id: snapshot.anun_sq_id,
            anun_ds_anuncio: snapshot.anun_ds_anuncio,
            anun_tx_titulo: snapshot.anun_tx_titulo,
            anun_tx_subtitulo: snapshot.anun_tx_subtitulo,
            vitr_in_buttonmore: this.enableShowMore(snapshot.anun_tx_texto != "" ? snapshot.anun_tx_texto : ""),
            anun_tx_texto: snapshot.anun_tx_texto != "" && snapshot.anun_tx_texto != null ? this.replaceLineBreakVitrine(snapshot.anun_tx_texto) : "",
            anun_tx_urlavatar: snapshot.anun_tx_urlavatar,
            anun_tx_urlthumbnail: snapshot.anun_tx_urlthumbnail,
            anun_tx_urlbanner: snapshot.anun_tx_urlbanner,
            anun_tx_urlicone: snapshot.anun_tx_urlicone,
            anun_tx_urlslide1: snapshot.anun_tx_urlslide1,
            anun_tx_urlslide2: snapshot.anun_tx_urlslide2,
            anun_tx_urlslide3: snapshot.anun_tx_urlslide3,
            anun_tx_urlslide4: snapshot.anun_tx_urlslide4 != undefined ? snapshot.anun_tx_urlslide4 : "",
            anun_nr_curtidas: snapshot.anun_nr_curtidas,
            anun_nr_salvos: snapshot.anun_nr_salvos,
            anun_nr_visitas: snapshot.anun_nr_visitas,
            anun_in_status: snapshot.anun_in_status,
            empr_sq_id: snapshot.empr_sq_id,
            empr_nm_fantasia: snapshot.empr_nm_fantasia != undefined ? snapshot.empr_nm_fantasia : "",
            empr_tx_endereco: snapshot.empr_tx_endereco != undefined ? snapshot.empr_tx_endereco : "",
            empr_tx_bairro: snapshot.empr_tx_bairro != undefined ? snapshot.empr_tx_bairro : "",
            empr_tx_cidade: snapshot.empr_tx_cidade != undefined ? snapshot.empr_tx_cidade : "",
            empr_tx_telefone_1: snapshot.empr_tx_telefone_1 != undefined ? snapshot.empr_tx_telefone_1 : "",
            empr_nr_documento: snapshot.empr_nr_documento != undefined ? snapshot.empr_nr_documento : "",
            muni_sq_id: snapshot.muni_sq_id,
            tian_sq_id: snapshot.tian_sq_id,
            agen_sq_id: snapshot.agen_sq_id,
            anun_in_smartsite: snapshot.anun_in_smartsite,
            usua_sq_id: snapshot.usua_sq_id != undefined ? snapshot.usua_sq_id : "",
            anun_nr_imagens: snapshot.anun_nr_imagens != undefined ? snapshot.anun_nr_imagens : "",
            anun_in_curtida: snapshot.anun_in_curtida != undefined ? snapshot.anun_in_curtida : false,
            cupo_sq_id: snapshot.cupo_sq_id != undefined ? snapshot.cupo_sq_id : false,
            cupo_nr_desconto: snapshot.cupo_nr_desconto != undefined ? snapshot.cupo_nr_desconto : false,
            cupo_nr_vlatual: snapshot.cupo_nr_vlatual != undefined ? snapshot.cupo_nr_vlatual : false,
            tpcu_sq_id: snapshot.tpcu_sq_id != undefined ? snapshot.tpcu_sq_id : false,
            cupo_nnr_qtdecupom: snapshot.cupo_nnr_qtdecupom != undefined ? snapshot.cupo_nnr_qtdecupom : false,
            cupo_nr_qtdedisponivel: snapshot.cupo_nr_qtdedisponivel != undefined ? snapshot.cupo_nr_qtdedisponivel : false,
            cupo_in_status: snapshot.cupo_in_status != undefined ? snapshot.cupo_in_status : false,
            cupo_dt_validade: snapshot.cupo_dt_validade != undefined ? snapshot.cupo_dt_validade : null,
            cupo_nr_vlcomdesconto: snapshot.cupo_nr_vlcomdesconto != undefined ? snapshot.cupo_nr_vlcomdesconto : null,
        };

        return vitrine;
    }

    // getVitrineJSON(vitrine: VitrineVO): string {
    //     let json: any =
    //         {
    //             vitr_sq_id: vitrine.vitr_sq_id,
    //             vitr_dt_agendada: vitrine.vitr_dt_agendada,
    //             vitr_sq_ordem: vitrine.vitr_sq_ordem,
    //             anun_sq_id: vitrine.anun_sq_id,
    //             anun_ds_anuncio: vitrine.anun_ds_anuncio,
    //             anun_tx_titulo: vitrine.anun_tx_titulo,
    //             anun_tx_subtitulo: vitrine.anun_tx_subtitulo,
    //             vitr_in_buttonmore: this.enableShowMore(vitrine.anun_tx_texto != "" ? vitrine.anun_tx_texto : ""),
    //             anun_tx_texto: vitrine.anun_tx_texto != "" && vitrine.anun_tx_texto != null ? this.replaceLineBreakVitrine(vitrine.anun_tx_texto) : "",
    //             anun_tx_urlavatar: vitrine.anun_tx_urlavatar,
    //             anun_tx_urlthumbnail: vitrine.anun_tx_urlthumbnail,
    //             anun_tx_urlbanner: vitrine.anun_tx_urlbanner,
    //             anun_tx_urlicone: vitrine.anun_tx_urlicone,
    //             anun_tx_urlslide1: vitrine.anun_tx_urlslide1,
    //             anun_tx_urlslide2: vitrine.anun_tx_urlslide2,
    //             anun_tx_urlslide3: vitrine.anun_tx_urlslide3,
    //             anun_tx_urlslide4: vitrine.anun_tx_urlslide4 != undefined ? vitrine.anun_tx_urlslide4 : "",
    //             anun_nr_curtidas: vitrine.anun_nr_curtidas,
    //             anun_nr_salvos: vitrine.anun_nr_salvos,
    //             anun_nr_visitas: vitrine.anun_nr_visitas,
    //             anun_in_status: vitrine.anun_in_status,
    //             empr_sq_id: vitrine.empr_sq_id,
    //             empr_nm_fantasia: vitrine.empr_nm_fantasia,
    //             muni_sq_id: vitrine.muni_sq_id,
    //             tian_sq_id: vitrine.tian_sq_id,
    //             agen_sq_id: vitrine.agen_sq_id,
    //             anun_in_smartsite: vitrine.anun_in_smartsite,
    //             usua_sq_id: vitrine.usua_sq_id != undefined ? vitrine.usua_sq_id : "",
    //             anun_nr_imagens: vitrine.anun_nr_imagens != undefined ? vitrine.anun_nr_imagens : "",
    //             anun_in_curtida: vitrine.anun_in_curtida != undefined ? vitrine.anun_in_curtida : false
    //         };

    //     return json;
    // }

    public getUserJson(user: UsuarioVO): string {
        let json: any =
            {
                usua_sq_id: user.usua_sq_id,
                usua_nm_usuario: user.usua_nm_usuario,
                usua_tx_login: user.usua_tx_login,
                usua_tx_senha: user.usua_tx_senha,
                usua_ds_sexo: user.usua_ds_sexo,
                usua_dt_inclusao: CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.enUS),
                usua_ds_telefone: user.usua_ds_telefone,
                usua_ds_email: user.usua_ds_email,
                usua_nr_reputacao: 0,
                usua_tx_observacao: user.usua_tx_observacao,
                usua_in_empresa: false,
                usua_in_ajuda: false,
                usua_tx_urlprofile: user.usua_tx_urlprofile != undefined ? user.usua_tx_urlprofile : user.usua_tx_urlprofile,
                usua_sg_perfil: user.usua_sg_perfil
            }

        return json;
    }


    public getUsuario(snapshot: any): UsuarioVO {
        let muniUsu: MunicipioVO = null;

        if (snapshot.val().municipio != undefined) {
            muniUsu = new MunicipioVO();
            muniUsu.muni_sq_id = snapshot.val().municipio.muni_sq_id;
            muniUsu.muni_nm_municipio = snapshot.val().municipio.muni_nm_municipio;
        } else {
            muniUsu = new MunicipioVO();
        }

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
            usua_tx_urlprofile: snapshot.val().usua_tx_urlprofile != undefined ? snapshot.val().usua_tx_urlprofile : "",
            usua_sg_perfil: snapshot.val().usua_sg_perfil,
            empresa: this.getUsuarioEmpresa(snapshot),
            municipio: muniUsu
        };

        return usuario;
    }


    getUsuarioEmpresa(snapUsuaEmpr: any): EmpresaVO {

        if (snapUsuaEmpr.child('empresa').exists()) {

            var objEmpresaVal: any = Object.keys(snapUsuaEmpr.child('empresa').val())
            var empr: any = snapUsuaEmpr.child('empresa').val()[objEmpresaVal];

            let empresa: EmpresaVO = {
                empr_sq_id: empr.empr_sq_id,
                empr_nm_razaosocial: empr.empr_nm_razaosocial,
                empr_nm_fantasia: '',
                empr_tx_endereco: '',
                empr_tx_bairro: '',
                empr_tx_cidade: '',
                empr_sg_uf: '',
                empr_nr_cep: '',
                empr_nr_credito: 0,
                empr_tx_logomarca: '',
                empr_tx_telefone_1: '',
                empr_tx_telefone_2: '',
                empr_nm_contato: '',
                empr_ds_email: '',
                empr_ds_site: '',
                empr_sg_pessoa: '',
                empr_nr_documento: '',
                empr_nr_inscestadual: '',
                empr_nr_inscmunicipal: '',
                empr_tx_googlemaps: '',
                empr_tx_sobre: '',
                empr_tx_observacao: '',
                empr_nr_reputacao: 0,
                empr_in_mensagem: true,
                empr_in_parceiro: false,
                empr_tx_subcategoria: '',
                categoria: null,
                municipio: null,
                plano: null,
                isIndexNome: false
            }

            return empresa;
        }
        else {
            return null;
        }
    }

    getEmpresa(snapEmpr: any): EmpresaVO {
        let munic: MunicipioVO = null;
        let categ: CategoriaVO = null;

        if (snapEmpr.municipio != undefined) {
            var muniKey: any = Object.keys(snapEmpr.municipio);
            munic = {
                muni_sq_id: snapEmpr.municipio[muniKey].muni_sq_id,
                muni_nm_municipio: snapEmpr.municipio[muniKey].muni_nm_municipio
            }
        }

        if (snapEmpr.categoria != undefined) {
            var cateKey: any = Object.keys(snapEmpr.categoria);

            categ = {
                cate_sq_id: snapEmpr.categoria[cateKey].cate_sq_id,
                cate_nm_categoria: snapEmpr.categoria[cateKey].cate_nm_categoria,
                cate_tx_imagem: '',
                cate_in_tipo: ''
            }
        }

        let empresa: EmpresaVO = {
            empr_sq_id: snapEmpr.empr_sq_id,
            empr_nm_razaosocial: snapEmpr.empr_nm_razaosocial,
            empr_nm_fantasia: snapEmpr.empr_nm_fantasia,
            empr_tx_endereco: snapEmpr.empr_tx_endereco,
            empr_tx_bairro: snapEmpr.empr_tx_bairro,
            empr_tx_cidade: snapEmpr.empr_tx_cidade,
            empr_sg_uf: snapEmpr.empr_sg_uf,
            empr_nr_cep: snapEmpr.empr_nr_cep,
            empr_nr_credito: 0,
            empr_tx_logomarca: snapEmpr.empr_tx_logomarca,
            empr_tx_telefone_1: snapEmpr.empr_tx_telefone_1,
            empr_tx_telefone_2: snapEmpr.empr_tx_telefone_2,
            empr_nm_contato: snapEmpr.empr_nm_contato,
            empr_ds_email: snapEmpr.empr_ds_email,
            empr_ds_site: snapEmpr.empr_ds_site,
            empr_sg_pessoa: snapEmpr.empr_sg_pessoa,
            empr_nr_documento: snapEmpr.empr_nr_documento,
            empr_nr_inscestadual: snapEmpr.empr_nr_inscestadual,
            empr_nr_inscmunicipal: snapEmpr.empr_nr_inscmunicipal,
            empr_tx_googlemaps: snapEmpr.empr_tx_googlemaps,
            empr_tx_sobre: snapEmpr.empr_tx_sobre,
            empr_tx_observacao: snapEmpr.empr_tx_observacao,
            empr_nr_reputacao: 0,
            empr_in_mensagem: snapEmpr.empr_in_mensagem,
            empr_in_parceiro: snapEmpr.empr_in_parceiro,
            empr_tx_subcategoria: snapEmpr.empr_tx_subcategoria,
            categoria: categ,
            plano: null,
            isIndexNome: false,
            municipio: munic
        }

        return empresa;

    }

    private enableShowMore(texto: string) {
        var result = false;
        if (texto != null) {
            var lines: any = texto.split("\n");

            if (texto.length > 160 || lines.length > 4) {
                result = true;
            }
        }
        return result;
    }

    public getCupomCriado(snapCupo: any): CupomCriadoVO {
        var empresa: CupomEmpresaDTO = null;
        var municipio: MunicipioVO = null;
        var usuario: CupomUsuarioDTO = null;

        if (snapCupo.empresa != undefined) {
            empresa = new CupomEmpresaDTO();
            empresa.empr_sq_id = snapCupo.empresa.empr_sq_id;
            empresa.empr_nm_fantasia = snapCupo.empresa.empr_nm_fantasia;
            empresa.empr_tx_endereco = snapCupo.empresa.empr_tx_endereco;
            empresa.empr_tx_bairro = snapCupo.empresa.empr_tx_bairro;
            empresa.empr_tx_cidade = snapCupo.empresa.empr_tx_cidade;
            empresa.empr_tx_telefone_1 = snapCupo.empresa.empr_tx_telefone_1;
            empresa.empr_nr_documento = snapCupo.empresa.empr_nr_documento;

            if (snapCupo.empresa.municipio != undefined) {
                municipio = new MunicipioVO();
                municipio.muni_sq_id = snapCupo.empresa.municipio.muni_sq_id;
                municipio.muni_nm_municipio = snapCupo.empresa.municipio.muni_nm_municipio;

                empresa.municipio = municipio;
            }
        }

        if (snapCupo.usuario != undefined && snapCupo.usuario != null) {
            usuario = new CupomUsuarioDTO();
            usuario.usua_sq_id = snapCupo.usuario.usua_sq_id;
            usuario.usua_nm_usuario = snapCupo.usuario.usua_nm_usuario;
        }


        let cupomCriado: CupomCriadoVO = {
            usuario: usuario,
            cupo_id: snapCupo.cupo_id != undefined ? snapCupo.cupo_id : null,
            cupo_sq_id: snapCupo.cupo_sq_id,
            cupo_nr_desconto: snapCupo.cupo_nr_desconto,
            cupo_tx_urlimagem: snapCupo.cupo_tx_urlimagem,
            cupo_tx_regulamento: snapCupo.cupo_tx_regulamento,
            cupo_tx_titulo: snapCupo.cupo_tx_titulo,
            cupo_tx_descricao: snapCupo.cupo_tx_descricao,
            cupo_nr_vlatual: snapCupo.cupo_nr_vlatual,
            cupo_nr_vlcomdesconto: snapCupo.cupo_nr_vlcomdesconto,
            cupo_dt_cadastro: snapCupo.cupo_dt_cadastro != undefined ? snapCupo.cupo_dt_cadastro : "",
            cupo_dt_validade: snapCupo.cupo_dt_validade,
            tipoCupom: snapCupo.tipoCupom,
            cupo_nr_qtdecupom: snapCupo.cupo_nr_qtdecupom,
            cupo_nr_qtdedisponivel: snapCupo.cupo_nr_qtdedisponivel,
            empresa: empresa,
            cupo_in_status: snapCupo.cupo_in_status,
            cupo_sq_ordem: snapCupo.cupo_sq_ordem != undefined ? snapCupo.cupo_sq_ordem : "",
            vitr_sq_id: snapCupo.vitr_sq_id != undefined ? snapCupo.vitr_sq_id : "",
            cupo_dt_publicado: snapCupo.cupo_dt_publicado != undefined ? snapCupo.cupo_dt_publicado : null,
            tipo_tx_anuncio: snapCupo.tipo_tx_anuncio != undefined ? snapCupo.tipo_tx_anuncio : "",
            cupomItens: null,
            sort_sq_id: snapCupo.sort_sq_id != undefined ? snapCupo.sort_sq_id : ""
        }

        return cupomCriado;
    }

    public getCupom(snapCupo: any): CupomVO {
        var empresa: CupomEmpresaDTO = null;
        var municipio: MunicipioVO = null;

        if (snapCupo.cupoEmpresa != undefined) {
            empresa = new CupomEmpresaDTO();
            empresa.empr_sq_id = snapCupo.cupoEmpresa.empr_sq_id;
            empresa.empr_nm_fantasia = snapCupo.cupoEmpresa.empr_nm_fantasia;
            empresa.empr_tx_endereco = snapCupo.cupoEmpresa.empr_tx_endereco;
            empresa.empr_tx_bairro = snapCupo.cupoEmpresa.empr_tx_bairro;
            empresa.empr_tx_cidade = snapCupo.cupoEmpresa.empr_tx_cidade;
            empresa.empr_tx_telefone_1 = snapCupo.cupoEmpresa.empr_tx_telefone_1;
            empresa.empr_nr_documento = snapCupo.cupoEmpresa.empr_nr_documento;

        } else if (snapCupo.empresa != undefined) {
            empresa = new CupomEmpresaDTO();
            empresa.empr_sq_id = snapCupo.empresa.empr_sq_id;
            empresa.empr_nm_fantasia = snapCupo.empresa.empr_nm_fantasia;
            empresa.empr_tx_endereco = snapCupo.empresa.empr_tx_endereco;
            empresa.empr_tx_bairro = snapCupo.empresa.empr_tx_bairro;
            empresa.empr_tx_cidade = snapCupo.empresa.empr_tx_cidade;
            empresa.empr_tx_telefone_1 = snapCupo.empresa.empr_tx_telefone_1;

            if (snapCupo.empresa.municipio != undefined) {
                municipio = new MunicipioVO();
                municipio.muni_sq_id = snapCupo.empresa.municipio.muni_sq_id;
                municipio.muni_nm_municipio = snapCupo.empresa.municipio.muni_nm_municipio;

                empresa.municipio = municipio;
            }
        }

        let cupom: CupomVO = {
            cupo_id: snapCupo.cupo_id != undefined ? snapCupo.cupo_id : null,
            cupo_sq_id: snapCupo.cupo_sq_id,
            cupo_nr_desconto: snapCupo.cupo_nr_desconto,
            cupo_tx_urlimagem: snapCupo.cupo_tx_urlimagem,
            cupo_tx_regulamento: snapCupo.cupo_tx_regulamento,
            cupo_tx_titulo: snapCupo.cupo_tx_titulo,
            cupo_tx_descricao: snapCupo.cupo_tx_descricao,
            cupo_nr_vlatual: snapCupo.cupo_nr_vlatual,
            cupo_nr_vlcomdesconto: snapCupo.cupo_nr_vlcomdesconto,
            cupo_dt_cadastro: snapCupo.cupo_dt_cadastro != undefined ? snapCupo.cupo_dt_cadastro : "",
            cupo_dt_validade: snapCupo.cupo_dt_validade,
            tipoCupom: snapCupo.tipoCupom,
            cupo_nr_qtdecupom: snapCupo.cupo_nr_qtdecupom,
            cupo_nr_qtdedisponivel: snapCupo.cupo_nr_qtdedisponivel,
            empresa: empresa,
            cupo_in_status: snapCupo.cupo_in_status,
            cupo_sq_ordem: snapCupo.cupo_sq_ordem != undefined ? snapCupo.cupo_sq_ordem : "",
            vitr_sq_id: snapCupo.vitr_sq_id != undefined ? snapCupo.vitr_sq_id : "",
            cupo_dt_publicado: snapCupo.cupo_dt_publicado != undefined ? snapCupo.cupo_dt_publicado : null,
            tipo_tx_anuncio: snapCupo.tipo_tx_anuncio != undefined ? snapCupo.tipo_tx_anuncio : "",
            sort_sq_id: snapCupo.sort_sq_id != undefined ? snapCupo.sort_sq_id : ""
        }
        return cupom;
    }

    public copyVitrine(oldVitrine: any, newVitrine: any): VitrineVO {

        oldVitrine.vitr_sq_id = oldVitrine.vitr_sq_id;
        oldVitrine.vitr_dt_agendada = newVitrine.vitr_dt_agendada;
        oldVitrine.vitr_sq_ordem = newVitrine.vitr_sq_ordem;
        oldVitrine.anun_sq_id = newVitrine.anun_sq_id;
        oldVitrine.anun_ds_anuncio = newVitrine.anun_ds_anuncio;
        oldVitrine.anun_tx_titulo = newVitrine.anun_tx_titulo;
        oldVitrine.anun_tx_subtitulo = newVitrine.anun_tx_subtitulo;
        oldVitrine.vitr_in_buttonmore = newVitrine.vitr_in_buttonmore;
        oldVitrine.anun_tx_texto = newVitrine.anun_tx_texto;
        oldVitrine.anun_tx_urlavatar = newVitrine.anun_tx_urlavatar;
        oldVitrine.anun_tx_urlthumbnail = newVitrine.anun_tx_urlthumbnail;
        oldVitrine.anun_tx_urlbanner = newVitrine.anun_tx_urlbanner;
        oldVitrine.anun_tx_urlicone = newVitrine.anun_tx_urlicone;
        oldVitrine.anun_tx_urlslide1 = newVitrine.anun_tx_urlslide1;
        oldVitrine.anun_tx_urlslide2 = newVitrine.anun_tx_urlslide2;
        oldVitrine.anun_tx_urlslide3 = newVitrine.anun_tx_urlslide3;
        oldVitrine.anun_tx_urlslide4 = newVitrine.anun_tx_urlslide4;
        oldVitrine.anun_nr_curtidas = newVitrine.anun_nr_curtidas;
        oldVitrine.anun_nr_salvos = newVitrine.anun_nr_salvos;
        oldVitrine.anun_nr_visitas = newVitrine.anun_nr_visitas;
        oldVitrine.anun_in_status = newVitrine.anun_in_status;
        oldVitrine.empr_sq_id = newVitrine.empr_sq_id;
        oldVitrine.empr_nm_fantasia = newVitrine.empr_nm_fantasia;
        oldVitrine.muni_sq_id = newVitrine.muni_sq_id;
        oldVitrine.tian_sq_id = newVitrine.tian_sq_id;
        oldVitrine.agen_sq_id = newVitrine.agen_sq_id;
        oldVitrine.anun_in_smartsite = newVitrine.anun_in_smartsite;
        oldVitrine.usua_sq_id = newVitrine.usua_sq_id;
        oldVitrine.anun_nr_imagens = newVitrine.anun_nr_imagens;

        return oldVitrine;
    }


    private replaceLineBreakVitrine(texto: string) {
        // var newText = "<p class='ctd-noticia'>";
        // newText = newText + texto.replace(/\n/gi,'<br/>');
        // newText = newText + "</p>";

        var newText = texto.replace(/\n/gi, '<br/>');
        return newText;
    }

    public getMunicipio(snapMunicipio: any): MunicipioVO {

        let municipio: MunicipioVO = {
            muni_sq_id: snapMunicipio.muni_sq_id,
            muni_nm_municipio: snapMunicipio.muni_nm_municipio
        }

        return municipio;

    }

    public copyCupomForVitrine(cupom: CupomCriadoVO): VitrineVO {

        let vitrine: VitrineVO = {
            vitr_sq_id: null,
            vitr_dt_agendada: null,
            vitr_sq_ordem: null,
            anun_sq_id: null,
            anun_ds_anuncio: cupom.cupo_tx_descricao,
            anun_tx_titulo: cupom.cupo_tx_titulo,
            anun_tx_subtitulo: null,
            vitr_in_buttonmore: null,
            anun_tx_texto: cupom.cupo_tx_regulamento,
            anun_tx_urlavatar: null,
            anun_tx_urlthumbnail: null,
            anun_tx_urlbanner: null,
            anun_tx_urlicone: null,
            anun_tx_urlslide1: cupom.cupo_tx_urlimagem,
            anun_tx_urlslide2: null,
            anun_tx_urlslide3: null,
            anun_tx_urlslide4: null,
            anun_nr_curtidas: null,
            anun_nr_salvos: null,
            anun_nr_visitas: null,
            anun_in_status: null,
            empr_sq_id: cupom.empresa.empr_sq_id,
            empr_nm_fantasia: cupom.empresa.empr_nm_fantasia,
            empr_tx_endereco: cupom.empresa.empr_tx_endereco,
            empr_tx_bairro: cupom.empresa.empr_tx_bairro,
            empr_tx_cidade: cupom.empresa.empr_tx_cidade,
            empr_tx_telefone_1: cupom.empresa.empr_tx_telefone_1,
            empr_nr_documento: cupom.empresa.empr_nr_documento,
            muni_sq_id: cupom.empresa.municipio.muni_sq_id,
            tian_sq_id: cupom.tipo_tx_anuncio,
            agen_sq_id: null,
            anun_in_smartsite: null,
            usua_sq_id: cupom.usuario.usua_sq_id,
            anun_nr_imagens: null,
            anun_in_curtida: false,
            cupo_sq_id: cupom.cupo_sq_id,
            cupo_nr_desconto: cupom.cupo_nr_desconto,
            cupo_nr_vlatual: cupom.cupo_nr_vlatual,
            tpcu_sq_id: cupom.tipoCupom,
            cupo_nnr_qtdecupom: cupom.cupo_nr_qtdecupom,
            cupo_nr_qtdedisponivel: cupom.cupo_nr_qtdedisponivel,
            cupo_in_status: cupom.cupo_in_status,
            cupo_dt_validade: cupom.cupo_dt_validade != undefined ? cupom.cupo_dt_validade : null,
            cupo_nr_vlcomdesconto: cupom.cupo_nr_vlcomdesconto != undefined ? cupom.cupo_nr_vlcomdesconto : null,
        }

        return vitrine;
    }

    public getMeuCupom(cupom: any): CupomCriadoVO {
        var meuCupom: CupomCriadoVO = new CupomCriadoVO();
        meuCupom.cupo_sq_id = cupom.cupo_sq_id;
        meuCupom.cupo_tx_titulo = cupom.cupo_tx_titulo;
        meuCupom.cupo_tx_descricao = cupom.cupo_tx_descricao;
        meuCupom.cupo_tx_regulamento = cupom.cupo_tx_regulamento;
        meuCupom.cupo_dt_validade = cupom.cupo_dt_validade;
        meuCupom.cupo_nr_desconto = cupom.cupo_nr_desconto;
        meuCupom.cupo_tx_urlimagem = cupom.cupo_tx_urlimagem;
        meuCupom.cupo_nr_vlatual = cupom.cupo_nr_vlatual;
        meuCupom.cupo_nr_vlcomdesconto = cupom.cupo_nr_vlcomdesconto;
        meuCupom.tipoCupom = cupom.tipoCupom;
        meuCupom.tipo_tx_anuncio = cupom.tipo_tx_anuncio;
        meuCupom.sort_sq_id = cupom.sort_sq_id;
        meuCupom.cupomItens = null;

        var empresa: CupomEmpresaDTO = new CupomEmpresaDTO();
        empresa.empr_sq_id = cupom.empr_sq_id;
        empresa.empr_nm_fantasia = cupom.empr_nm_fantasia;
        empresa.empr_tx_bairro = cupom.empr_tx_bairro;
        empresa.empr_tx_cidade = cupom.empr_tx_cidade;
        empresa.empr_tx_telefone_1 = cupom.empr_tx_telefone_1;
        empresa.empr_tx_endereco = cupom.empr_tx_endereco;
        empresa.empr_nr_documento = cupom.empr_nr_documento;

        var municipio: MunicipioVO = new MunicipioVO();
        municipio.muni_sq_id = cupom.muni_sq_id;

        empresa.municipio = municipio;
        meuCupom.empresa = empresa;

        return meuCupom;
    }

    public getCupomCriadoSQL(obj: any): Array<CupomCriadoVO> {
        var empresa: CupomEmpresaDTO = null;
        var municipio: MunicipioVO = null;
        var usuario: CupomUsuarioDTO = null;
        var cupomCriado: CupomCriadoVO = null;
        var cupons: Array<CupomCriadoVO> = [];
        var cuponsItens: Array<CupomCriadoItemVO> = null;
        var objecFind: CupomCriadoVO = null;

        if (obj != null && obj.rows.length > 0) {
            for (let index = 0; index < obj.rows.length; index++) {

                var cupomSqId: string = obj.rows.item(index).cupo_sq_id;

                if (cupons != null && cupons.length > 0) {
                    objecFind = this.itenSrv.findElement(cupons, (v: any) => v.cupo_sq_id == cupomSqId);
                }

                if (objecFind == null) {
                    cupomCriado = new CupomCriadoVO();

                    if (obj.rows.item(index).empr_sq_id != null) {
                        empresa = new CupomEmpresaDTO();
                        empresa.empr_sq_id = obj.rows.item(index).empr_sq_id;
                        empresa.empr_nm_fantasia = obj.rows.item(index).empr_nm_fantasia;
                        empresa.empr_tx_endereco = obj.rows.item(index).empr_tx_endereco;
                        empresa.empr_tx_bairro = obj.rows.item(index).empr_tx_bairro;
                        empresa.empr_tx_cidade = obj.rows.item(index).empr_tx_cidade;
                        empresa.empr_tx_telefone_1 = obj.rows.item(index).empr_tx_telefone_1;
                        empresa.empr_nr_documento = obj.rows.item(index).empr_nr_documento;

                        if (obj.rows.item(index).muni_sq_id != null) {
                            municipio = new MunicipioVO();
                            municipio.muni_sq_id = obj.rows.item(index).muni_sq_id;

                            empresa.municipio = municipio;
                        } else {
                            municipio = new MunicipioVO();
                            empresa.municipio = municipio;
                        }

                        cupomCriado.empresa = empresa;
                    }
                    else {
                        empresa = new CupomEmpresaDTO();
                        cupomCriado.empresa = empresa;
                    }

                    usuario = new CupomUsuarioDTO();
                    cupomCriado.usuario = usuario;
     
                    cupomCriado.cupo_sq_id = cupomSqId;
                    cupomCriado.cupo_tx_titulo = obj.rows.item(index).cupo_tx_titulo;
                    cupomCriado.cupo_tx_descricao = obj.rows.item(index).cupo_tx_descricao;
                    cupomCriado.cupo_tx_regulamento = obj.rows.item(index).cupo_tx_regulamento;
                    cupomCriado.cupo_dt_validade = obj.rows.item(index).cupo_dt_validade;
                    cupomCriado.cupo_nr_desconto = obj.rows.item(index).cupo_nr_desconto;
                    cupomCriado.sort_sq_id = obj.rows.item(index).sort_sq_id;

                    var pathApp: string = this.glbVar.getAppPathStorage().replace("file:///", "/");
                    var pathImg: string = pathApp + obj.rows.item(index).cupo_tx_urlimagem;
                    cupomCriado.cupo_tx_urlimagem = pathImg

                    cupomCriado.cupo_nr_vlatual = obj.rows.item(index).cupo_nr_vlatual;
                    cupomCriado.cupo_nr_vlcomdesconto = obj.rows.item(index).cupo_nr_vlcomdesconto;
                    cupomCriado.tipoCupom = obj.rows.item(index).tipoCupom;
                    cupomCriado.cupo_in_status = obj.rows.item(index).cupo_in_status

                    cupomCriado.cupo_dt_cadastro = null;
                    cupomCriado.cupo_nr_qtdecupom = 0;
                    cupomCriado.cupo_nr_qtdedisponivel = 0;
                    cupomCriado.cupo_sq_ordem = "";
                    cupomCriado.vitr_sq_id = "";
                    cupomCriado.cupo_dt_publicado = null;
                    cupomCriado.tipo_tx_anuncio = "";

                    //Cupom de sorteio
                    if (cupomCriado.tipoCupom == 2) {
                        cuponsItens = new Array<CupomCriadoItemVO>();
                        var cupomItem: CupomCriadoItemVO = new CupomCriadoItemVO();

                        cupomItem.id = obj.rows.item(index).coi_id;
                        cupomItem.cupo_sq_id = obj.rows.item(index).coi_cupo_sq_id;
                        cupomItem.cupo_nr_cupom = obj.rows.item(index).coi_cupo_nr_cupom;

                        var empresa:CupomEmpresaDTO = new CupomEmpresaDTO();
                        empresa.empr_sq_id = obj.rows.item(index).coi_empr_sq_id;
                        empresa.empr_nm_fantasia = obj.rows.item(index).coi_empr_nm_fantasia;
                        empresa.empr_nr_documento = obj.rows.item(index).coi_empr_nr_documento;  cupomItem.empresa = empresa;
                        
                        cupomItem.cupo_in_status = obj.rows.item(index).coi_cupo_in_status;

                        cuponsItens.push(cupomItem);
                        cupomCriado.cupomItens = cuponsItens;
                    }

                    cupons.push(cupomCriado);

                }
                else {

                    var cupomItem: CupomCriadoItemVO = new CupomCriadoItemVO();

                    cupomItem.cupo_sq_id = obj.rows.item(index).coi_cupo_sq_id;
                    cupomItem.cupo_nr_cupom = obj.rows.item(index).coi_cupo_nr_cupom;

                    var empresa:CupomEmpresaDTO = new CupomEmpresaDTO();
                    empresa.empr_sq_id = obj.rows.item(index).coi_empr_sq_id;
                    empresa.empr_nm_fantasia = obj.rows.item(index).coi_empr_nm_fantasia;
                    empresa.empr_nr_documento = obj.rows.item(index).coi_empr_nr_documento;  cupomItem.empresa = empresa;

                    cupomItem.cupo_in_status = obj.rows.item(index).coi_cupo_in_status;

                    objecFind.cupomItens.push(cupomItem);

                }
            }
        }

        return cupons;
    }

}
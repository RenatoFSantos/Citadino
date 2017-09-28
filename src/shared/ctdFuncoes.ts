import { CallNumber } from '@ionic-native/call-number';
import * as enums from './../model/dominio/ctdEnum'

export class CtdFuncoes {

    private static formatDate = new Intl.DateTimeFormat(["pt-BR"], {
        year: "numeric", day: "2-digit", month: "2-digit"
    });

    private static formatTime = new Intl.DateTimeFormat(["pt-BR"], {
        hour: "2-digit", minute: "2-digit"
    });

    public static convertDateToStr(value: Date, dtFormat: number): string {
        var result: string = "";

        if (dtFormat == enums.DateFormat.ptBR) {
            result = this.formatDate.format(value);
        }
        else {
            var dt = this.formatDate.format(value);
            result = dt.substring(6, 10) + '-' + dt.substring(3, 5) + '-' +
                dt.substring(0, 2);
        }

        return result;
    }

    public static convertTimeToStr(value: Date): string {
        return this.formatTime.format(value);

    }

    public static removeEspacosDuplos(strTexto: string): string {
        while (strTexto.indexOf("  ") > 0)
            strTexto = strTexto.replace("  ", " ");

        return strTexto;
    }

    public static removerAcentos(strTexto: string): string {
        let comAcentos: string = "ÄÅÁÂÀÃäáâàãÉÊËÈéêëèÍÎÏÌíîïìÖÓÔÒÕöóôòõÜÚÛüúûùÇç";
        let semAcentos: String = "AAAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUuuuuCc";

        for (var index = 0; index < comAcentos.length; index++) {
            strTexto = strTexto.replace(comAcentos.charAt(index), semAcentos.charAt(index));
        }

        return strTexto;
    }

    public static discarTelefone(number: string) {
        let callNumber: CallNumber = new CallNumber();
        callNumber.callNumber(number, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
    }

    public static ellipsis(strTexto: string, length: number): string {

        if (strTexto != null && strTexto.trim() != "") {   
            if (strTexto.length > length) {
                strTexto = strTexto.substr(0, length) + "...";
            }         
        }

        return strTexto;
    }

}
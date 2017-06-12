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
}
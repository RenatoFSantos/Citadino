import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';
declare var window: any;

@Injectable()
export class NotificacaoService {

  constructor() {
  }

  sendUidMensagem(uid: Array<string>, subtitle: string, content: string, eventTypePush: number) {


    var promise = new Promise(function (resolve, reject) {

      window.plugins.OneSignal.getIds(function (ids) {
        var notificationObj = {
          data: { eventType: eventTypePush },
          headings: { "en": subtitle },
          contents: { "en": content },
          include_player_ids: uid,
          small_icon: "ic_stat_icon",
          large_icon: "icon",
          ios_badgeType:"Increase",
          ios_badgeCount: 1,
          android_group: subtitle,
          priority:10,
          android_accent_color: "008641",
          android_group_message: { "en": "Você tem  $[notif_count] novas mensagens" }
        };

        window.plugins.OneSignal.postNotification(notificationObj,
          function (successResponse) {
            resolve(true);
            console.log("Notificação enviado com sucesso:", successResponse);
          },
          function (failedResponse) {
            console.log("Notificação falhou: ", failedResponse);
            reject("Não foi possível enviar a notificação.");
            // alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
          }
        );
      });
    });

    return promise;
  }
}

import { Injectable } from '@angular/core';
declare var window: any;

@Injectable()
export class NotificacaoService {

  constructor() {
  }

  sendMensagem(uid:Array<string>, subtitle:string, content:string, eventTypePush:number) {

     var eventType = {"eventType": "1"};
     var jsonData = JSON.stringify(eventType);

    window.plugins.OneSignal.getIds(function (ids) {
      var notificationObj = {
        data : { eventType:eventTypePush },        
        headings: { "en": subtitle },
        contents: { "en": content },
        include_player_ids: uid,
        small_icon : "ic_stat_icon",
        large_icon: "icon",
        android_group: subtitle,
        android_accent_color:"008641",
        android_group_message:{"en": "Você tem  $[notif_count] novas mensagens"}
      };

      window.plugins.OneSignal.postNotification(notificationObj,
        function (successResponse) {
          console.log("Notificação enviado com sucesso:", successResponse);
        },
        function (failedResponse) {
          console.log("Notificação falhou: ", failedResponse);
          // alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
        }
      );
    });
  }

}

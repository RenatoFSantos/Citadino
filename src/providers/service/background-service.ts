import { Injectable } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode';

@Injectable()
export class BackgroundService {

  constructor(private backgroundMode: BackgroundMode) {
    this.configure();
  }

  enable() {
    this.backgroundMode.enable();
  }

  disable() {
    this.backgroundMode.disable();
  }

  configure() {
    this.backgroundMode.setDefaults({
      title: "Citadino",
      text: "Sua plataforma de negócio na cidade."
    });
  }
}

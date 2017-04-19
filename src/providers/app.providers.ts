import { Network } from '@ionic-native/Network';
import { GlobalVar } from './global-var';
import { LoginService } from './service/login-service';
import { FirebaseService } from './database/firebase-service';
import { VitrineService } from './service/vitrine-service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export const APP_PROVIDERS = [
    SplashScreen,
    StatusBar,
    VitrineService,
    FirebaseService,
    LoginService,
    GlobalVar,
    Network
];
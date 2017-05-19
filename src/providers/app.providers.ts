import { MappingsService } from './service/mappings.service';
import { ItemsService } from './service/items.service';
import { SQLite } from '@ionic-native/sqlite';
import { SqLiteService } from './database/sqlite-service';
import { GlobalVar } from './../shared/global-var';
import { NetworkService } from './service/network-service';
import { AgendaService } from './service/angenda-service';
import { Network } from '@ionic-native/Network';
import { LoginService } from './service/login-service';
import { FirebaseService } from './database/firebase-service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export const APP_PROVIDERS = [
    SplashScreen,
    StatusBar,    
    Network,
    SQLite,
    AgendaService,
    FirebaseService,
    SqLiteService,
    LoginService,
    ItemsService,
    MappingsService,
    GlobalVar,
    NetworkService
];
import { SmartSiteService } from './service/smartSite-services';
import { CallNumber } from '@ionic-native/call-number';
import { MensagemService } from './service/mensagem-service';
import { UsuarioService } from './service/usuario-service';
import { EmpresaService } from './service/empresa-service';
import { GuiaService } from './service/guia-service';
import { MappingsService } from './service/_mappings-service';
import { ItemsService } from './service/_items-service';
import { SQLite } from '@ionic-native/sqlite';
import { SqLiteService } from './database/sqlite-service';
import { GlobalVar } from './../shared/global-var';
import { NetworkService } from './service/network-service';
import { VitrineService } from './service/vitrine-service';
import { Network } from '@ionic-native/Network';
import { FirebaseService } from './database/firebase-service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ElasticModule } from 'angular2-elastic';

export const APP_PROVIDERS = [
    SplashScreen,
    StatusBar,    
    Network,
    SQLite,
    VitrineService,
    EmpresaService,
    GuiaService,
    FirebaseService,
    SqLiteService,
    UsuarioService,
    ItemsService,
    MappingsService,
    GlobalVar,
    NetworkService,
    MensagemService,
    SmartSiteService,
    ElasticModule,
    CallNumber
];
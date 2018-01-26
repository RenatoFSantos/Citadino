import { FileTransfer } from '@ionic-native/file-transfer';
import { DownloadImageService } from './service/download-image-service';
import { MunicipioService } from './service/municipio-service';
import { CupomCriadoService } from './service/cupom-criado-service';
import { CurrencyMask } from './../shared/currency-mask';
import { VitrineCurtirService } from './service/vitrine-curtir-service';
import { CupomService } from './service/cupom-service';
import { UsuarioCupomService } from './service/usuario-cupom-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { UsuarioSqlService } from './database/usuario-sql-service';
import { MinhasPublicacoesService } from './service/minhas-publicacoes';
import { MeusMarcadosService } from './service/meus_marcados-service';
import { BackgroundService } from './service/background-service';
import { NotificacaoService } from './service/notificacao-service';
import { TokenDeviceService } from './service/token-device';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SmartSiteService } from './service/smartSite-services';
import { CallNumber } from '@ionic-native/call-number';
import { MensagemService } from './service/mensagem-service';
import { UsuarioService } from './service/usuario-service';
import { EmpresaService } from './service/empresa-service';
import { GuiaService } from './service/guia-service';
import { MappingsService } from './service/_mappings-service';
import { ItemsService } from './service/_items-service';
import { SQLite } from '@ionic-native/sqlite';
import { GlobalVar } from './../shared/global-var';
import { NetworkService } from './service/network-service';
import { VitrineService } from './service/vitrine-service';
import { Network } from '@ionic-native/Network';
import { FirebaseService } from './database/firebase-service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import { Camera } from '@ionic-native/camera';
import { BackgroundMode } from '@ionic-native/background-mode';
import { SqlLiteService } from './database/sqlLite-service';
import { PromocaoService } from './service/promocao-service';
import { File } from '@ionic-native/file';


export const APP_PROVIDERS = [
    SplashScreen,
    StatusBar,    
    Network,
    SQLite,
    VitrineService,
    EmpresaService,
    GuiaService,
    FirebaseService,
    UsuarioService,
    ItemsService,
    MappingsService,
    GlobalVar,
    NetworkService,
    MensagemService,
    SmartSiteService,
    CallNumber,
    InAppBrowser,
    TokenDeviceService,
    NotificacaoService,
    OneSignal,
    Camera,
    BackgroundMode,
    BackgroundService,
    MeusMarcadosService,
    MinhasPublicacoesService,
    SqlLiteService,
    UsuarioSqlService,
    BarcodeScanner,
    CupomService,
    UsuarioCupomService,
    PromocaoService,
    VitrineCurtirService,
    CurrencyMask,
    CupomCriadoService,
    MunicipioService,
    DownloadImageService,
    FileTransfer,
    File
];
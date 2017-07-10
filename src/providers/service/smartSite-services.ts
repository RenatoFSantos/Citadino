import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class SmartSiteService {
    private smartSiteRef: any;

    constructor(public fbService: FirebaseService) {
        this.smartSiteRef = this.fbService.getDataBase().ref('smartsite');
    }

    getSmartSiteByKey(key:string) {
        return this.smartSiteRef.child(key).once('value');
    }
 
}
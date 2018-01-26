Versao 2.0.2
Sobre: Implementação da funcionalidade de criar cupons de desconto.

Novos Plugins:
npm install brmasker-ionic-3 --save

import { BrMaskerModule } from 'brmasker-ionic-3';
@NgModule({
    imports: [
        ...
        BrMaskerModule
    ],
<ion-input type="text" name="cpf" placeholder="CPF/CNPJ" [brmasker]="{person: true}"></ion-input>
</ion-item>
 <ion-input type="text" name="money" placeholder="(R$) Real" [brmasker]="{money: true}"></ion-input>
</ion-item>
 <ion-input type="text" name="phone" placeholder="Phone" [brmasker]="{phone: true}"></ion-input>
</ion-item>
[brmasker]="{mask:'00/00/0000', len:10}" -- data
[brmasker]="{mask:'00.000-000', len:10}"  --cep
[brmasker]="{mask:'000.000.000-00', len:14}" --cpf
[brmasker]="{mask:'00.000.000/0000-00', len:18}" --cnpj
[brmasker]="{mask:'(00) 0000-0000', len:14}" --telefone
[brmasker]="{mask:'(00) 00000-0000', len:15}" --whatsapp
<ion-item>
	<ion-input type="text" name="cpf" placeholder="CPF/CNPJ" [brmasker]="{person: true}"></ion-input>
</ion-item>
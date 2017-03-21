import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-relat-fidelidade',
  templateUrl: 'relat-fidelidade.html'
})
export class RelatFidelidadePage {

  @ViewChild('lineCanvas') lineCanvas;

  lineChart: any;
  public flagView: boolean = false;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('Recarga: ' + this.flagView);
    
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

        type: 'line',
        data: {
            labels: ["Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            datasets: [
                {
                    label: "Acumulado 2016",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [39, 65, 80, 81, 85, 95, 100],
                    spanGaps: false,
                }
            ],
            options: {
                title: {
                    display: true,
                    text: 'Teste de Título do Gráfico'
                }
            }
        }
    });
  }

  tapEvent(e) {
    if(this.flagView) {
      this.flagView = false;
    } else {
      this.flagView = true;
      console.log('Início da Recarga');
      // this.ionViewDidLoad();
      console.log('Fim do Recarga');
    }
  }

}

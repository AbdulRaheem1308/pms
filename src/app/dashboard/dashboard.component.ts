import { Component, OnInit } from '@angular/core';
import { InvestmentData, MockService } from '../mock.service';
import * as Highcharts from 'highcharts';
import { SeriesOptionsType } from 'highcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  receivedData: InvestmentData[] = [];

  highcharts = Highcharts;
  assetChartOptions: Highcharts.Options = {};
  performanceChartOptions: Highcharts.Options = {};

  constructor(private mockService: MockService) {}

  ngOnInit() {
    this.mockService.investmentData$.subscribe((data: Set<InvestmentData>) => {
      this.receivedData = Array.from(data);
      this.getAssetDetails();
      this.getPerformenceDetails();
    });
  }

  getAssetDetails(): void {
    const assetSeriesData: { name: string; y: number }[] = [];
    this.receivedData.forEach((data: InvestmentData) => {
      assetSeriesData.push({
        name: data.assetType,
        y: data.quantity * data.purchasePrice,
      });
    });

    this.assetChartOptions = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Asset Allocations',
      },
      plotOptions: {
        pie: {
          innerSize: '50%',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Assets',
          data: assetSeriesData,
        },
      ] as SeriesOptionsType[],
    };
  }

  getPerformenceDetails(): void {
    const performanceSeriesData: { name: string; x: number; y: number }[] = [];

    this.receivedData.forEach((data: InvestmentData) => {
      performanceSeriesData.push({
        name: data.assetType,
        x: new Date(data.purchaseDate).getTime(),
        y: data.purchasePrice * data.quantity,
      });
    });

    this.performanceChartOptions = {
      chart: {
        zooming: {
          type: 'x',
        },
      },
      title: {
        text: 'Total Performance',
      },
      subtitle: {
        text:
          document.ontouchstart === undefined
            ? 'Click and drag in the plot area to zoom in'
            : 'Pinch the chart to zoom in',
      },
      xAxis: {
        type: 'datetime',
        minRange: 14 * 24 * 3600000, // fourteen days
      },
      yAxis: {
        title: {
          text: 'Value',
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: this.getColorStops(),
          },
          marker: {
            radius: 2,
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          threshold: null,
        },
      },
      series: [
        {
          type: 'area',
          name: 'Performance',
          data: performanceSeriesData,
        },
      ],
    };
  }

  private getColorStops(): [number, string][] {
    const colors = Highcharts.getOptions().colors;
    if (colors && colors.length > 0) {
      return [
        [0, colors[0] as string],
        [1, Highcharts.color(colors[0]).setOpacity(0).get('rgba') as string],
      ];
    } else {
      return [
        [0, '#7cb5ec'],
        [1, 'rgba(124, 181, 236, 0)'],
      ];
    }
  }
}

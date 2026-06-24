import Chart from 'chart.js/auto';

export class GreenhouseChart {
  private chart: Chart | null = null;

  constructor(canvasId: string) {
    const ctx = (document.getElementById(canvasId) as HTMLCanvasElement)?.getContext('2d');
    if (ctx) {
      this.initChart(ctx);
    }
  }

  private initChart(ctx: CanvasRenderingContext2D): void {
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [] as string[],
        datasets: [
          {
            label: 'Suhu (°C)',
            data: [] as number[],
            borderColor: '#3b82f6',
            borderWidth: 2,
            pointRadius: 2,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Kelembaban (%)',
            data: [] as number[],
            borderColor: '#22c55e',
            borderWidth: 2,
            pointRadius: 2,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Cahaya',
            data: [] as number[],
            borderColor: '#eab308',
            borderWidth: 1.5,
            borderDash: [5, 5],
            pointRadius: 0,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false, color: '#333' }, ticks: { color: '#888' } },
          y: {
            type: 'linear', display: true, position: 'left',
            grid: { color: '#333' }, ticks: { color: '#888' },
            suggestedMin: 0, suggestedMax: 100
          },
          y1: {
            type: 'linear', display: true, position: 'right',
            grid: { display: false }, ticks: { color: '#eab308' },
            suggestedMin: 0, suggestedMax: 4095
          }
        },
        animation: { duration: 0 }
      }
    });
  }

  public updateData(suhu: string, kelembaban: string, cahaya: string): void {
    if (!this.chart) return;

    const now = new Date();
    const timeLabel = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const dataRef = this.chart.data;

    if (dataRef.labels && dataRef.labels.length > 25) {
      dataRef.labels.shift();
      dataRef.datasets[0].data.shift();
      dataRef.datasets[1].data.shift();
      dataRef.datasets[2].data.shift();
    }

    dataRef.labels?.push(timeLabel);
    dataRef.datasets[0].data.push(parseFloat(suhu));
    dataRef.datasets[1].data.push(parseFloat(kelembaban));
    dataRef.datasets[2].data.push(parseFloat(cahaya));

    this.chart.update();
  }
}
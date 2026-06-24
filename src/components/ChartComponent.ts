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
            backgroundColor: '#3b82f6',
            borderWidth: 2,
            pointRadius: 1, 
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Kelembaban (%)',
            data: [] as number[],
            borderColor: '#22c55e', 
            backgroundColor: '#22c55e',
            borderWidth: 2,
            pointRadius: 1,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Cahaya',
            data: [] as number[],
            borderColor: '#f59e0b', 
            backgroundColor: '#f59e0b',
            borderWidth: 2,
            borderDash: [4, 4], 
            pointRadius: 0,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: {
            mode: 'index', intersect: false, backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1e293b', bodyColor: '#475569', borderColor: '#e2e8f0', borderWidth: 1
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#64748b', maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
          y: {
            type: 'linear', display: true, position: 'left',
            grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' },
            suggestedMin: 0, suggestedMax: 100
          },
          y1: {
            type: 'linear', display: true, position: 'right',
            grid: { display: false }, ticks: { color: '#f59e0b' },
            suggestedMin: 0, suggestedMax: 4095
          }
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        animation: { duration: 0 } 
      }
    });
  }

  public updateData(suhu: string, kelembaban: string, cahaya: string): void {
    if (!this.chart) return;

    const now = new Date();
    const timeLabel = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const dataRef = this.chart.data;

    if (dataRef.labels && dataRef.labels.length > 30) {
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
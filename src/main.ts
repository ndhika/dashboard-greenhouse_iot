import mqtt, { type MqttClient, type IClientOptions } from 'mqtt';
import Chart from 'chart.js/auto';

// --- Konfigurasi HiveMQ Cloud ---
// Gunakan awalan wss:// dan akhiri dengan port 8884 dan path /mqtt
const brokerUrl: string = import.meta.env.VITE_MQTT_URL;

const mqttOptions: IClientOptions = {
  username: import.meta.env.VITE_MQTT_USERNAME,
  password: import.meta.env.VITE_MQTT_PASSWORD,
  clientId: `orakom_web_${Math.random().toString(16).slice(3)}`,
};

const TOPIC_SUHU = 'orakom/greenhouse/suhu';
const TOPIC_CAHAYA = 'orakom/greenhouse/cahaya';
const TOPIC_KONTROL = 'orakom/greenhouse/kontrol_atap';

const elSuhu = document.getElementById('suhuValue') as HTMLSpanElement;
const elCahaya = document.getElementById('cahayaValue') as HTMLSpanElement;
const elStatus = document.getElementById('statusAtap') as HTMLSpanElement;
const elConnStatus = document.getElementById('connectionStatus') as HTMLDivElement;
const elConnText = document.getElementById('connectionText') as HTMLSpanElement;
const btnBuka = document.getElementById('btnBuka') as HTMLButtonElement;
const btnTutup = document.getElementById('btnTutup') as HTMLButtonElement;

const ctx = (document.getElementById('logChart') as HTMLCanvasElement).getContext('2d');
let logChart: Chart;

if (ctx) {
  logChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [] as string[],
      datasets: [{
        label: 'Suhu (°C)',
        data: [] as number[],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { display: true, title: { display: true, text: 'Waktu' } },
        y: { display: true, title: { display: true, text: 'Suhu (°C)' }, suggestedMin: 20, suggestedMax: 40 }
      },
      animation: { duration: 0 }
    }
  });
}

function updateChart(suhu: string): void {
  if (!logChart) return;
  
  const now = new Date();
  const timeLabel = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
  const dataRef = logChart.data;
  if (dataRef.labels && dataRef.labels.length > 20) {
    dataRef.labels.shift();
    dataRef.datasets[0].data.shift();
  }
  
  dataRef.labels?.push(timeLabel);
  dataRef.datasets[0].data.push(parseFloat(suhu));
  logChart.update();
}

// --- Koneksi MQTT ---
console.log('Mencoba terhubung ke broker...', brokerUrl);
const client: MqttClient = mqtt.connect(brokerUrl, mqttOptions);

client.on('connect', () => {
  console.log('Berhasil terhubung ke MQTT Broker (HiveMQ Cloud)');
  elConnStatus.classList.replace('bg-red-500', 'bg-green-500');
  elConnText.innerText = 'Online';
  
  client.subscribe([TOPIC_SUHU, TOPIC_CAHAYA], (err) => {
    if (err) console.error('Gagal subscribe:', err);
  });
});

client.on('error', (err: Error) => {
  console.error('Koneksi MQTT Error:', err);
  elConnText.innerText = 'Error / Ditolak';
});

client.on('message', (topic: string, message: Buffer) => {
  const val = message.toString();
  if (topic === TOPIC_SUHU) {
    elSuhu.innerText = val;
    updateChart(val);
  } else if (topic === TOPIC_CAHAYA) {
    elCahaya.innerText = val;
  }
});

btnBuka.addEventListener('click', () => {
  if (client.connected) {
    client.publish(TOPIC_KONTROL, 'buka');
    elStatus.innerText = 'Terbuka';
    elStatus.classList.replace('text-slate-700', 'text-green-600');
  } else {
    alert('Belum terhubung ke broker MQTT!');
  }
});

btnTutup.addEventListener('click', () => {
  if (client.connected) {
    client.publish(TOPIC_KONTROL, 'tutup');
    elStatus.innerText = 'Tertutup';
    elStatus.classList.replace('text-green-600', 'text-slate-700');
  } else {
    alert('Belum terhubung ke broker MQTT!');
  }
});
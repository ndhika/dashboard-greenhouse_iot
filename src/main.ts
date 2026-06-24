import { GreenhouseChart } from './components/ChartComponent';
import { MqttService } from './services/MqttService';

// --- Mengambil Semua Elemen DOM ---
const elSuhu = document.getElementById('suhuValue') as HTMLSpanElement;
const elKelembaban = document.getElementById('kelembabanValue') as HTMLSpanElement;
const elCahaya = document.getElementById('cahayaValue') as HTMLSpanElement;
const elStatus = document.getElementById('statusAtap') as HTMLSpanElement;
const elConnStatus = document.getElementById('connectionStatus') as HTMLDivElement;
const elConnText = document.getElementById('connectionText') as HTMLSpanElement;
const btnBuka = document.getElementById('btnBuka') as HTMLButtonElement;
const btnTutup = document.getElementById('btnTutup') as HTMLButtonElement;

// --- Inisialisasi Komponen Grafik ---
const greenhouseChart = new GreenhouseChart('mainChart');
const sensorBuffer = { suhu: '', kelembaban: '', cahaya: '' };

function checkAndPushToChart() {
  if (sensorBuffer.suhu && sensorBuffer.kelembaban && sensorBuffer.cahaya) {
    greenhouseChart.updateData(sensorBuffer.suhu, sensorBuffer.kelembaban, sensorBuffer.cahaya);
    sensorBuffer.suhu = '';
    sensorBuffer.kelembaban = '';
    sensorBuffer.cahaya = '';
  }
}

// --- Inisialisasi MQTT Service dengan Callback Berbasis Kelas ---
const mqttService = new MqttService(
  () => {
    elConnStatus.classList.replace('bg-red-500', 'bg-green-500');
    elConnText.innerText = 'ONLINE & SINKRON';
    elConnText.classList.replace('text-slate-600', 'text-green-600');
  },
  (topic, message) => {
    const topics = mqttService.getTopics();
    if (topic === topics.suhu) {
      elSuhu.innerText = message;
      sensorBuffer.suhu = message;
    } 
    else if (topic === topics.kelembaban) {
      elKelembaban.innerText = message;
      sensorBuffer.kelembaban = message;
    }
    else if (topic === topics.cahaya) {
      elCahaya.innerText = message;
      sensorBuffer.cahaya = message;
    }
    checkAndPushToChart();
  },
  (err) => {
    console.error('MQTT Error:', err);
    elConnText.innerText = 'ERROR / DITOLAK';
    elConnText.classList.replace('text-green-600', 'text-red-600');
    elConnStatus.classList.replace('bg-green-500', 'bg-red-500');
  }
);

btnBuka.addEventListener('click', () => {
  mqttService.publishKontrolAtap('buka');
  elStatus.innerHTML = '<i class="fa-solid fa-lock-open text-emerald-500 mr-1"></i> STATUS: TERBUKA';
});

btnTutup.addEventListener('click', () => {
  mqttService.publishKontrolAtap('tutup');
  elStatus.innerHTML = '<i class="fa-solid fa-lock text-red-500 mr-1"></i> STATUS: TERTUTUP';
});
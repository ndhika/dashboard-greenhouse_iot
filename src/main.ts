import { GreenhouseChart } from './components/ChartComponent';
import { MqttService } from './services/MqttService';

const elSuhu = document.getElementById('suhuValue') as HTMLSpanElement;
const elKelembaban = document.getElementById('kelembabanValue') as HTMLSpanElement;
const elCahaya = document.getElementById('cahayaValue') as HTMLSpanElement;
const elStatus = document.getElementById('statusAtap') as HTMLSpanElement;
const elConnStatus = document.getElementById('connectionStatus') as HTMLDivElement;
const elConnText = document.getElementById('connectionText') as HTMLSpanElement;
const btnBuka = document.getElementById('btnBuka') as HTMLButtonElement;
const btnTutup = document.getElementById('btnTutup') as HTMLButtonElement;

const insightCard = document.getElementById('insightCard') as HTMLDivElement;
const insightIconBox = document.getElementById('insightIconBox') as HTMLDivElement;
const insightIcon = document.getElementById('insightIcon') as HTMLElement;
const insightBgIcon = document.getElementById('insightBgIcon') as HTMLElement; 
const insightTitle = document.getElementById('insightTitle') as HTMLHeadingElement;
const insightText = document.getElementById('insightText') as HTMLParagraphElement;

const greenhouseChart = new GreenhouseChart('mainChart');
const sensorBuffer = { suhu: '', kelembaban: '', cahaya: '' };

function updateLiveInsight(suhuNum: number, kelNum: number, cahNum: number) {
  if (cahNum < 1500 && suhuNum > 31) {
    insightCard.className = "lg:col-span-1 bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm transition-colors duration-500 flex flex-col h-full relative overflow-hidden";
    insightIconBox.className = "w-12 h-12 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center text-red-600 transition-colors duration-500";
    insightIcon.className = "fa-solid fa-fire text-xl animate-bounce";
    insightBgIcon.className = "fa-solid fa-triangle-exclamation absolute -right-6 -bottom-6 text-9xl text-red-500 opacity-5 transition-colors duration-500";
    insightTitle.className = "text-sm font-bold text-red-800 tracking-wide uppercase leading-tight";
    insightText.className = "text-sm text-red-700 font-medium leading-relaxed flex-1 relative z-10";
    insightTitle.innerText = "KONDISI KRITIS";
    insightText.innerHTML = `Suhu udara melonjak tajam ke <b>${suhuNum}°C</b>! Panas terperangkap karena atap tertutup.<br><br><span class="text-red-800 font-semibold"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Peringatan:</span><br>Tanaman sangat berisiko mengalami dehidrasi dan layu permanen. Segera buka atap untuk mengalirkan sirkulasi udara!`;
  } 
  else if (cahNum >= 1500 && suhuNum <= 29) {
    insightCard.className = "lg:col-span-1 bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm transition-colors duration-500 flex flex-col h-full relative overflow-hidden";
    insightIconBox.className = "w-12 h-12 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 transition-colors duration-500";
    insightIcon.className = "fa-solid fa-leaf text-xl";
    insightBgIcon.className = "fa-brands fa-envira absolute -right-6 -bottom-6 text-9xl text-green-500 opacity-5 transition-colors duration-500";
    insightTitle.className = "text-sm font-bold text-green-800 tracking-wide uppercase leading-tight";
    insightText.className = "text-sm text-green-700 font-medium leading-relaxed flex-1 relative z-10";
    insightTitle.innerText = "KONDISI OPTIMAL";
    insightText.innerHTML = `Lingkungan sangat seimbang. Suhu sejuk <b>${suhuNum}°C</b> dan paparan cahaya matahari sangat melimpah.<br><br><span class="text-green-800 font-semibold"><i class="fa-solid fa-check-circle mr-1"></i> Dampak:</span><br>Proses fotosintesis dan bukaan stomata daun berjalan dengan sangat sempurna.`;
  } 
  else {
    insightCard.className = "lg:col-span-1 bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm transition-colors duration-500 flex flex-col h-full relative overflow-hidden";
    insightIconBox.className = "w-12 h-12 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 transition-colors duration-500";
    insightIcon.className = "fa-solid fa-temperature-arrow-up text-xl";
    insightBgIcon.className = "fa-solid fa-temperature-half absolute -right-6 -bottom-6 text-9xl text-blue-500 opacity-5 transition-colors duration-500";
    insightTitle.className = "text-sm font-bold text-blue-800 tracking-wide uppercase leading-tight";
    insightText.className = "text-sm text-blue-700 font-medium leading-relaxed flex-1 relative z-10";
    insightTitle.innerText = "TRANSISI LINGKUNGAN";
    insightText.innerHTML = `Suhu sedang beradaptasi. Tingkat kelembaban udara saat ini berada di <b>${kelNum}%</b>.<br><br><span class="text-blue-800 font-semibold"><i class="fa-solid fa-eye mr-1"></i> Tindakan:</span><br>Sistem terus memantau pergerakan udara secara real-time.`;
  }
}

function checkAndPushToChart() {
  if (sensorBuffer.suhu && sensorBuffer.kelembaban && sensorBuffer.cahaya) {
    greenhouseChart.updateData(sensorBuffer.suhu, sensorBuffer.kelembaban, sensorBuffer.cahaya);
    
    updateLiveInsight(
      parseFloat(sensorBuffer.suhu), 
      parseFloat(sensorBuffer.kelembaban), 
      parseFloat(sensorBuffer.cahaya)
    );

    sensorBuffer.suhu = '';
    sensorBuffer.kelembaban = '';
    sensorBuffer.cahaya = '';
  }
}

const mqttService = new MqttService(
  () => {
    elConnStatus.classList.replace('bg-red-500', 'bg-green-500');
    elConnText.innerText = 'ONLINE & SINKRON';
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
    elConnText.innerText = 'ERROR KONEKSI';
    elConnStatus.classList.replace('bg-green-500', 'bg-red-500');
  }
);

btnBuka.addEventListener('click', () => {
  mqttService.publishKontrolAtap('buka');
  elStatus.innerHTML = '<i class="fa-solid fa-arrow-up text-green-500 mr-1"></i> STATUS: TERBUKA';
});

btnTutup.addEventListener('click', () => {
  mqttService.publishKontrolAtap('tutup');
  elStatus.innerHTML = '<i class="fa-solid fa-arrow-down text-slate-400 mr-1"></i> STATUS: TERTUTUP';
});
import { GreenhouseChart } from './components/ChartComponent';
import { MqttService } from './services/MqttService';
import { renderDashboard, type DashboardElements } from './ui/renderDashboard';
import { updateLiveInsight } from './insights';

interface SensorBuffer {
  suhu: string;
  kelembaban: string;
  cahaya: string;
}

export function initApp(rootId = 'app'): void {
  const root = document.getElementById(rootId);
  if (!root) {
    throw new Error(`Elemen #${rootId} tidak ditemukan`);
  }

  const elements = renderDashboard(root as HTMLElement);
  const greenhouseChart = new GreenhouseChart('mainChart');
  const sensorBuffer: SensorBuffer = {
    suhu: '',
    kelembaban: '',
    cahaya: ''
  };

  const checkAndPushToChart = () => {
    if (!sensorBuffer.suhu || !sensorBuffer.kelembaban || !sensorBuffer.cahaya) {
      return;
    }

    greenhouseChart.updateData(sensorBuffer.suhu, sensorBuffer.kelembaban, sensorBuffer.cahaya);
    updateLiveInsight(
      elements,
      parseFloat(sensorBuffer.suhu),
      parseFloat(sensorBuffer.kelembaban),
      parseFloat(sensorBuffer.cahaya)
    );

    sensorBuffer.suhu = '';
    sensorBuffer.kelembaban = '';
    sensorBuffer.cahaya = '';
  };

  bindControlButtons(elements);

  const mqttService = new MqttService(
    () => {
      elements.elConnStatus.classList.replace('bg-red-500', 'bg-green-500');
      elements.elConnText.innerText = 'ONLINE & SINKRON';
    },
    (topic, message) => {
      const topics = mqttService.getTopics();

      if (topic === topics.suhu) {
        elements.elSuhu.innerText = message;
        sensorBuffer.suhu = message;
      } else if (topic === topics.kelembaban) {
        elements.elKelembaban.innerText = message;
        sensorBuffer.kelembaban = message;
      } else if (topic === topics.cahaya) {
        elements.elCahaya.innerText = message;
        sensorBuffer.cahaya = message;
      }

      checkAndPushToChart();
    },
    (err) => {
      console.error('MQTT Error:', err);
      elements.elConnText.innerText = 'ERROR KONEKSI';
      elements.elConnStatus.classList.replace('bg-green-500', 'bg-red-500');
    }
  );

  function bindControlButtons(elements: DashboardElements): void {
    elements.btnBuka.addEventListener('click', () => {
      mqttService.publishKontrolAtap('buka');
      elements.elStatus.innerHTML = '<i class="fa-solid fa-arrow-up text-green-500 mr-1"></i> STATUS: TERBUKA';
    });

    elements.btnTutup.addEventListener('click', () => {
      mqttService.publishKontrolAtap('tutup');
      elements.elStatus.innerHTML = '<i class="fa-solid fa-arrow-down text-slate-400 mr-1"></i> STATUS: TERTUTUP';
    });
  }
}

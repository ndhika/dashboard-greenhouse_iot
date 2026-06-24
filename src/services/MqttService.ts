import mqtt, { type MqttClient, type IClientOptions } from 'mqtt';

export class MqttService {
  private client: MqttClient | null = null;
  private topics = {
    suhu: 'orakom/greenhouse/suhu',
    kelembaban: 'orakom/greenhouse/kelembaban',
    cahaya: 'orakom/greenhouse/cahaya',
    kontrol: 'orakom/greenhouse/kontrol_atap'
  };

  private onConnectCallback: () => void;
  private onMessageCallback: (topic: string, message: string) => void;
  private onErrorCallback: (err: Error) => void;

  constructor(
    onConnectCallback: () => void,
    onMessageCallback: (topic: string, message: string) => void,
    onErrorCallback: (err: Error) => void
  ) {
    // 3. Masukkan nilainya ke dalam properti (this)
    this.onConnectCallback = onConnectCallback;
    this.onMessageCallback = onMessageCallback;
    this.onErrorCallback = onErrorCallback;
    this.connect();
  }

  private connect(): void {
    const brokerUrl = import.meta.env.VITE_MQTT_URL;
    const options: IClientOptions = {
      username: import.meta.env.VITE_MQTT_USERNAME,
      password: import.meta.env.VITE_MQTT_PASSWORD,
      clientId: `orakom_web_${Math.random().toString(16).slice(3)}`,
    };

    console.log('Memulai koneksi ke HiveMQ Cloud...');
    this.client = mqtt.connect(brokerUrl, options);

    this.client.on('connect', () => {
      this.onConnectCallback();
      this.subscribeToSensors();
    });

    this.client.on('message', (topic, message) => {
      this.onMessageCallback(topic, message.toString());
    });

    this.client.on('error', (err) => {
      this.onErrorCallback(err);
    });
  }

  private subscribeToSensors(): void {
    if (!this.client) return;
    this.client.subscribe([this.topics.suhu, this.topics.kelembaban, this.topics.cahaya], (err) => {
      if (err) console.error('Gagal melakukan subscribe topik sensor:', err);
    });
  }

  public publishKontrolAtap(command: 'buka' | 'tutup'): void {
    if (this.client && this.client.connected) {
      this.client.publish(this.topics.kontrol, command);
    } else {
      alert('Koneksi MQTT terputus! Gagal mengirim perintah.');
    }
  }

  public getTopics() {
    return this.topics;
  }
}
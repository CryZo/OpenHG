import mqtt, { MqttClient } from "mqtt";

export class MQTTHandler {
	url: string;
	connected: boolean = false;

	subscribed: any = {};
	Queue: any = {}

	Client: MqttClient;

	constructor(Url: string) {
		this.url = Url;

		this.Client = mqtt.connect(this.url)
		this.Client.on('connect', () => {
			this.connected = true;

			for (let i in this.Queue) {
				this.Subscribe(i, this.Queue[i]);
				delete this.Queue[i];
			}
		});

		this.Client.on('message', (topic, message) => {
			if (this.subscribed[topic])
				this.subscribed[topic](message);
		});
	}

	SendCommand(topic: string, payload: string): void {
		this.Client.publish(topic, payload);
	}

	Subscribe(topic: string, callback: (payload: string) => void): void {
		if (this.connected) {
			this.Client.subscribe(topic, function (err) {
				if (err) throw err;
			})

			this.subscribed[topic] = callback;
		}
		else {
			this.Queue[topic] = callback;
		}
	}
}
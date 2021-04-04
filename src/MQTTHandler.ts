import mqtt, { MqttClient } from "mqtt";

export default class MQTTHandler {
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
			Object.entries(this.subscribed).forEach(([key, value]) => {
				if (key.includes('#')) {
					let term = `^${key.replace('/', '\/').replace('#', '.+')}`
					let re = new RegExp(term);
					if (re.test(topic))
						(<any>value)(message, topic);
				}
			});

			if (this.subscribed[topic])
				this.subscribed[topic](message, topic);
		});
	}

	SendCommand(topic: string, payload: string): void {
		this.Client.publish(topic, payload);
	}

	SendRetainedCommand(topic: string, payload: string): void {
		this.Client.publish(topic, payload, {retain: true});
	}

	Subscribe(topic: string, callback: (payload: string, topic?: string) => void): void {
		// if (topic === 'shellies/shelly1l-84CCA8ADEE79/input/1') debugger;
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
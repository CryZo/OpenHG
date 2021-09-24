import { Device, MQTTHandler } from "..";
import { DeviceType, Trait } from "../Enums";
import { ITemperature, IHumidity } from "../interfaces/Traits";

export default class HomematicThermometer extends Device implements ITemperature, IHumidity {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Sensors;
	Traits: Trait[] = [Trait.Temperature, Trait.Humidity];
	IsRoomTemperature = true;

	mh: MQTTHandler;
	channelName: string;

	Humidity: number = 0;
	Temperature: number = 0;

	constructor(Name: string, id: string, mh: MQTTHandler) {
		super();
		
		this.Name = Name;
		this._id = id;
		this.mh = mh;

	}
	Run(): void {
		this.mh.Subscribe(`hm/status/${this.channelName}/ACTUAL_TEMPERATURE`, this.onMQTTTemperature.bind(this))
		this.mh.Subscribe(`hm/status/${this.channelName}/HUMIDITY`, this.onMQTTHumidity.bind(this))
	}

	onMQTTTemperature(payload: Buffer): void {
		let tmpVal: number;

		if (!isNaN(parseInt(payload.toString()))) {
			tmpVal = parseInt(payload.toString());

			if (tmpVal !== this.Temperature) {
				this.Temperature = tmpVal;
				global.eventHandler.fire('change', this);
			}
		}
	}

	onMQTTHumidity(payload: Buffer): void {
		let tmpVal: number;

		if (!isNaN(parseInt(payload.toString()))) {
			tmpVal = parseInt(payload.toString());

			if (tmpVal !== this.Humidity) {
				this.Humidity = tmpVal;
				global.eventHandler.fire('change', this);
			}
		}
	}
}

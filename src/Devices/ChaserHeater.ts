import { Device, MQTTHandler } from "../";
import { DeviceType, Trait } from "../Enums";
import { IOnOff, ITemperatureSetting, ITemperature, IHumidity } from "../interfaces/Traits";

export default class ChaserHeater extends Device implements IOnOff, ITemperatureSetting, ITemperature, IHumidity {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Heater;
	Traits: Trait[] = [Trait.OnOff, Trait.TemperatureSetting, Trait.Temperature, Trait.Humidity];

	Status: boolean = false;
	AutomationTemperature: number = 0;
	TargetTemperature: number = 0;
	Temperature: number = 0;
	IsRoomTemperature = true;
	Humidity: number = 0;

	mh: MQTTHandler;
	devId: string;

	constructor(Name: string, id: string, mh: MQTTHandler) {
		super();

		this.Name = Name;
		this._id = id;
		this.mh = mh;
	}
	Run(): void {
		this.mh.Subscribe(`${this.devId}/status`, this.onMQTTStatus.bind(this));
		this.mh.Subscribe(`${this.devId}/target`, this.onMQTTTarget.bind(this));
		this.mh.Subscribe(`${this.devId}/temp`, this.onMQTTTemp.bind(this));
		this.mh.Subscribe(`${this.devId}/hum`, this.onMQTTHum.bind(this));
	}

	onMQTTStatus(payload: string): void {
		let tmpStatus = false;
		if (payload.toString() == 'on') tmpStatus = true;

		if (tmpStatus !== this.Status) {
			this.Status = tmpStatus;
			global.eventHandler.fire('change', this);
		}
	}
	onMQTTTemp(payload: string): void {
		if (parseFloat(payload) !== this.Temperature) {
			this.Temperature = parseFloat(payload);
			global.eventHandler.fire('change', this);
		}
	}
	onMQTTTarget(payload: string): void {
		if (parseFloat(payload) !== this.TargetTemperature) {
			this.TargetTemperature = parseFloat(payload);
			global.eventHandler.fire('change', this);
		}
	}
	onMQTTHum(payload: string): void {
		if (parseFloat(payload) !== this.Humidity) {
			this.Humidity = parseFloat(payload);
			global.eventHandler.fire('change', this);
		}
	}
 
	TurnOn(): void {
		this.Status = true;
		this.mh.SendCommand(`${this.devId}/cmd/status`, 'on');
		global.eventHandler.fire('change', this);
	}
	TurnOff(): void {
		this.Status = false;
		this.mh.SendCommand(`${this.devId}/cmd/status`, 'off');
		global.eventHandler.fire('change', this);
	}
	Toggle(): void {
		if (this.Status) this.TurnOff();
		else this.TurnOn();
	}

	SetTemperature(value: number): void {
		this.TargetTemperature = value;
		this.mh.SendCommand(`${this.devId}/cmd/target`, value.toString());
		global.eventHandler.fire('change', this);
	}

	IncreaseTemperature(): void {
		this.SetTemperature(this.Temperature+1);
	}
	ReduceTemperature(): void {
		this.SetTemperature(this.Temperature-1);
	}
}
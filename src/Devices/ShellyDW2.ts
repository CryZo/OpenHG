import { Device, MQTTHandler } from "../";
import { ITemperature, IOpenCloseStatus, IIllumination, IVibration, ILux, IBattery } from "../interfaces/Traits/";
import { DeviceType, Trait } from "../Enums";

export default class ShellyDW2  extends Device implements IOpenCloseStatus, ITemperature, ILux, IIllumination, IBattery, IVibration {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Blinds;
	Traits: Trait[] = [Trait.OpenCloseStatus, Trait.Temperature, Trait.Lux, Trait.Illumination, Trait.Battery, Trait.Vibration];

	Temperature: number = 0;
	IsRoomTemperature: boolean = true;

	Battery: number = 0;
	Illumination: number = 0;
	Lux: number = 0;
	Status: boolean = false;
	Vibration: boolean = false;

	mh: MQTTHandler;
	shellyDevId: string;

	constructor(Name: string, id: string, mh: MQTTHandler) {
		super();
		
		this.Name = Name;
		this._id = id;
		this.mh = mh;
	}
	Run(): void {
		this.mh.Subscribe(`shellies/shellydw2-${this.shellyDevId}/sensor/state`, this.onMQTTStatus.bind(this));
		//TODO this.mh.Subscribe(`shellies/shellydw2-${this.shellyDevId}/sensor/tilt`, this.onMQTTTilt.bind(this));
		this.mh.Subscribe(`shellies/shellydw2-${this.shellyDevId}/sensor/vibration`, this.onMQTTVibration.bind(this));
		this.mh.Subscribe(`shellies/shellydw2-${this.shellyDevId}/sensor/lux`, this.onMQTTLux.bind(this));
		this.mh.Subscribe(`shellies/shellydw2-${this.shellyDevId}/sensor/battery`, this.onMQTTBattery.bind(this));
	}

	onMQTTStatus(payload: Buffer): void {
		let tmpStatus: boolean;
		switch (payload.toString()) {
			case 'open':
				tmpStatus = true;
				break;

			case 'close':
				tmpStatus = false;
				break;
		}

		if (tmpStatus !== undefined && tmpStatus !== this.Status) {
			this.Status = tmpStatus;
			global.eventHandler.fire('change', this);

			if (this.Status) this.emit('open');
			else             this.emit('close');
		}
	}
	onMQTTVibration(payload: Buffer): void {
		let tmpStatus: boolean;
		switch (payload.toString()) {
			case '1':
				tmpStatus = true;
				break;

			case '0':
				tmpStatus = false;
				break;
		}

		if (tmpStatus !== undefined && tmpStatus !== this.Vibration) {
			this.Vibration = tmpStatus;
			global.eventHandler.fire('change', this);

			if (this.Vibration) this.emit('vibration');
		}
	}
	onMQTTLux(payload: Buffer): void {
		let tmpVal: number;

		if (!isNaN(parseInt(payload.toString()))) {
			tmpVal = parseInt(payload.toString());

			if (tmpVal !== this.Lux) {
				this.Lux = tmpVal;
				global.eventHandler.fire('change', this);
			}
		}
	}
	onMQTTBattery(payload: Buffer): void {
		let tmpVal: number;

		if (!isNaN(parseInt(payload.toString()))) {
			tmpVal = parseInt(payload.toString());

			if (tmpVal !== this.Battery) {
				this.Battery = tmpVal;
				global.eventHandler.fire('change', this);
			}
		}
	}
}
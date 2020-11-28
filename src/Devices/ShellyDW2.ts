import { IDevice } from "../interfaces/DeviceTypes/IDevice";
import { ITemperature } from "../interfaces/Traits/ITemperature";
import { IOpenCloseStatus } from "../interfaces/Traits/IOpenCloseStatus";
import { IIllumination } from "../interfaces/Traits/IIllumination";
import { IVibration } from "../interfaces/Traits/IVibration";
import { ILux } from "../interfaces/Traits/ILux";
import { IBattery } from "../interfaces/Traits/IBattery";

import { DeviceType } from "../Enums/DeviceType";
import { MQTTHandler } from "../MQTTHandler";
import { Trait } from "../Enums/Trait";

export class ShellyDW2 implements IDevice, IOpenCloseStatus, ITemperature, ILux, IIllumination, IBattery, IVibration {
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

	//Defaults
	//TODO
	aog_Type: string = 'action.devices.types.LIGHT';
	aog_Traits: string[] = ['action.devices.traits.OnOff', 'action.devices.traits.ColorSetting']; //TODO
	aog_Attributes: null;

	mh: MQTTHandler;
	shellyDevId: string;

	constructor(Name: string, id: string, mh: MQTTHandler) {
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

	onMQTTStatus(payload: string): void {
		let tmpStatus: boolean;
		switch (payload) {
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
		}
	}
	onMQTTVibration(payload: string): void {
		let tmpStatus: boolean;
		switch (payload) {
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
		}
	}
	onMQTTLux(payload: string): void {
		let tmpVal: number;

		if (!isNaN(parseInt(payload))) {
			tmpVal = parseInt(payload);

			if (tmpVal !== this.Lux) {
				this.Lux = tmpVal;
				global.eventHandler.fire('change', this);
			}
		}
	}
	onMQTTBattery(payload: string): void {
		let tmpVal: number;

		if (!isNaN(parseInt(payload))) {
			tmpVal = parseInt(payload);

			if (tmpVal !== this.Battery) {
				this.Battery = tmpVal;
				global.eventHandler.fire('change', this);
			}
		}
	}
}
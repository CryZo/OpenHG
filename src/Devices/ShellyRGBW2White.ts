import { DeviceType } from "../Enums/DeviceType";
import { MQTTHandler } from "../MQTTHandler";
import { IRGBDevice } from "../interfaces/IRGBDevice";
import { Color } from "../Color";
import { IDimDevice } from "../interfaces/IDimDevice";

export class ShellyRGBW2White implements IDimDevice {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Dimmer;
	Status: boolean = false;
	Brightness: number = 0;

	//Defaults
	aog_Type: string = 'action.devices.types.LIGHT';
	aog_Traits: string[] = ['action.devices.traits.OnOff', 'action.devices.traits.ColorSetting']; //TODO
	aog_Attributes: null;

	lightenAmount: number = 20;

	mh: MQTTHandler;
	shellyDevId: string;
	outputNo: number;

	constructor(Name: string, id: string, mh: MQTTHandler) {
		this.Name = Name;
		this._id = id;
		this.mh = mh;
	}
	Run(): void {
		this.mh.Subscribe(`shellies/shellyrgbw2-${this.shellyDevId}/white/${this.outputNo}/status`, this.onMQTT.bind(this));
	}

	onMQTT(payload: string): void {
		/*if (payload.toString() == 'on') this.Status = true;
		else if (payload.toString() == 'off') this.Status = false;*/

		let data = JSON.parse(payload);

		if (data.ison != undefined)
			this.Status = data.ison;
		
		if (data.brightness != undefined) {
			this.Brightness = data.brightness;
		}
	}

	TurnOn(): void {
		this.Status = true;
		this.mh.SendCommand(`shellies/shellyrgbw2-${this.shellyDevId}/white/${this.outputNo}/command`, 'on');
	}
	TurnOff(): void {
		this.Status = false;
		this.mh.SendCommand(`shellies/shellyrgbw2-${this.shellyDevId}/white/${this.outputNo}/command`, 'off');
	}
	Toggle(): void {
		this.Status ? this.TurnOff() : this.TurnOn();
	}

	SetBrightness(value: number): void {
		this.Brightness = value;
		this.mh.SendCommand(`shellies/shellyrgbw2-${this.shellyDevId}/white/${this.outputNo}/set`, JSON.stringify({brightness: value, turn: 'on'}));
	}

	Lighten(amount: number = this.lightenAmount): void {
		this.Brightness += amount;
		if (this.Brightness > 100)
			this.Brightness = 100;

		this.SetBrightness(this.Brightness);
	}

	Darken(amount: number = this.lightenAmount): void {
		this.Brightness -= amount;
		if (this.Brightness < 0)
			this.Brightness = 0;

		this.SetBrightness(this.Brightness);
	}
}
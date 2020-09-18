import { DeviceType } from "../Enums/DeviceType";
import { MQTTHandler } from "../MQTTHandler";
import { IRGBDevice } from "../interfaces/IRGBDevice";
import { Color } from "../Color";

export class ShellyRGBW2Color implements IRGBDevice {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.RGB;
	Status: boolean = false;
	Color: Color = Color.GetBlack();

	//Defaults
	aog_Type: string = 'action.devices.types.LIGHT';
	aog_Traits: string[] = ['action.devices.traits.OnOff', 'action.devices.traits.ColorSetting'];
	aog_Attributes: any = {
		colorModel: 'rgb'
	};

	lightenAmount: number = 20;

	mh: MQTTHandler;
	shellyDevId: string;

	constructor(Name: string, id: string, mh: MQTTHandler) {
		this.Name = Name;
		this._id = id;
		this.mh = mh;
	}
	Run(): void {
		this.mh.Subscribe(`shellies/shellyrgbw2-${this.shellyDevId}/color/0/status`, this.onMQTT.bind(this));
	}

	onMQTT(payload: string): void {
		/*if (payload.toString() == 'on') this.Status = true;
		else if (payload.toString() == 'off') this.Status = false;*/

		let data = JSON.parse(payload);

		if (data.ison != undefined)
			this.Status = data.ison;
		
		if (data.red != undefined && data.green != undefined && data.blue != undefined) {
			let col = new Color();
			col.SetColors(data.red, data.green, data.blue);

			this.Color = col;
		}
	}

	TurnOn(): void {
		this.Status = true;
		this.mh.SendCommand(`shellies/shellyrgbw2-${this.shellyDevId}/color/0/command`, 'on');
	}
	TurnOff(): void {
		this.Status = false;
		this.mh.SendCommand(`shellies/shellyrgbw2-${this.shellyDevId}/color/0/command`, 'off');
	}
	Toggle(): void {
		this.Status ? this.TurnOff() : this.TurnOn();
	}

	SetColor(col: Color): void {
		this.mh.SendCommand(`shellies/shellyrgbw2-${this.shellyDevId}/color/0/set`, JSON.stringify({
			"mode": "color",
			"red": col.Red,
			"green": col.Green,
			"blue": col.Blue,
			"gain": 100,
			"white": 0,
			"effect": 0,
			"turn": "on"
		}));
	}
	GetColor(): Color {
		if (this.Status) {
			return this.Color;
		}
		else {
			return Color.GetBlack();
		}
	}

	Lighten(amount: number = this.lightenAmount): void {
		let col: Color = this.GetColor();
		col.Lighten(amount);
		this.SetColor(col);
	}

	Darken(amount: number = this.lightenAmount): void {
		let col: Color = this.GetColor();
		col.Darken(amount);
		this.SetColor(col);
	}
}
import { Color, Device, MQTTHandler } from "../";
import { IRGB } from "../interfaces/Traits";
import { DeviceType, Trait } from "../Enums/";

export default class ShellyRGBW2Color  extends Device implements IRGB {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Lights;
	Status: boolean = false;
	Color: Color = Color.GetBlack();
	Traits: Trait[] = [Trait.OnOff, Trait.RGB]

	lightenAmount: number = 20;

	mh: MQTTHandler;
	shellyDevId: string;
	effect: number = 0;

	constructor(Name: string, id: string, mh: MQTTHandler) {
		super();
		
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

		if (data.ison != undefined) {
			let tmpStatus = data.ison;

			if (tmpStatus !== this.Status) {
				this.Status = tmpStatus;
				global.eventHandler.fire('change', this);
			}
		}
		
		if (data.red != undefined && data.green != undefined && data.blue != undefined) {
			let col = new Color();
			col.SetColors(data.red, data.green, data.blue);

			if (col !== this.Color) {
				this.Color = col;
				global.eventHandler.fire('change', this);
			}
		}
	}

	TurnOn(): void {
		this.Status = true;
		this.mh.SendCommand(`shellies/shellyrgbw2-${this.shellyDevId}/color/0/command`, 'on');
		global.eventHandler.fire('change', this);
	}
	TurnOff(): void {
		this.Status = false;
		this.mh.SendCommand(`shellies/shellyrgbw2-${this.shellyDevId}/color/0/command`, 'off');
		global.eventHandler.fire('change', this);
	}
	Toggle(): void {
		this.Status ? this.TurnOff() : this.TurnOn();
		global.eventHandler.fire('change', this);
	}

	SetColor(col: Color): void {
		this.mh.SendCommand(`shellies/shellyrgbw2-${this.shellyDevId}/color/0/set`, JSON.stringify({
			"mode": "color",
			"red": col.Red,
			"green": col.Green,
			"blue": col.Blue,
			"gain": 100,
			"white": 0,
			"effect": this.effect,
			"turn": "on"
		}));
		global.eventHandler.fire('change', this);
	}
	GetColor(): Color {
		if (this.Status) {
			return this.Color;
		}
		else {
			return Color.GetBlack();
		}
	}

	LightenColor(amount: number = this.lightenAmount): void {
		let col: Color = this.GetColor();
		col.Lighten(amount);
		this.SetColor(col);
	}

	DarkenColor(amount: number = this.lightenAmount): void {
		let col: Color = this.GetColor();
		col.Darken(amount);
		this.SetColor(col);
	}
}
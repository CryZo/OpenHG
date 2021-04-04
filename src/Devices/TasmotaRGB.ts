import { Color, Device, MQTTHandler } from "../";
import { IRGB } from "../interfaces/Traits";
import { DeviceType, Trait } from "../Enums";

export default class TasmotaRGB  extends Device implements IRGB {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Lights;
	Traits: Trait[] = [Trait.OnOff, Trait.RGB]
	
	Status: boolean = false;
	Color: Color = Color.GetBlack();

	lightenAmount: number = 20;

	mh: MQTTHandler;
	tasmotaDevId: string;

	constructor(Name: string, id: string, mh: MQTTHandler) {
		super();
		
		this.Name = Name;
		this._id = id;
		this.mh = mh;
	}
	Run(): void {
		this.mh.Subscribe(`stat/${this.tasmotaDevId}/RESULT`, this.onMQTT.bind(this));
		this.mh.Subscribe(`stat/${this.tasmotaDevId}/STATE`, this.onMQTT.bind(this));
	}

	onMQTT(payload: string): void {
		let data: any = JSON.parse(payload.toString());
		if (data.Color) {
			let tmpColor = Color.Parse(data.Color);

			if (tmpColor !== this.Color) {
				this.Color = tmpColor;
				global.eventHandler.fire('change', this);
			}
		}

		let tmpStatus = false;
		if (data.POWER == 'ON') {
			tmpStatus = true;
		}

		if (tmpStatus !== this.Status) {
			this.Status = tmpStatus;
			global.eventHandler.fire('change', this);
		}
	}

	TurnOn(): void {
		this.Status = true;
		this.mh.SendCommand(`cmnd/${this.tasmotaDevId}/POWER`, 'ON');
		global.eventHandler.fire('change', this);
	}
	TurnOff(): void {
		this.Status = false;
		this.mh.SendCommand(`cmnd/${this.tasmotaDevId}/POWER`, 'OFF');
		global.eventHandler.fire('change', this);
	}
	Toggle(): void {
		this.Status = !this.Status;
		this.mh.SendCommand(`cmnd/${this.tasmotaDevId}/POWER`, 'TOGGLE');
		global.eventHandler.fire('change', this);
	}

	SetColor(col: Color): void {
		this.mh.SendCommand(`cmnd/${this.tasmotaDevId}/Color1`, `#${col.GetHexColor()}`);
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
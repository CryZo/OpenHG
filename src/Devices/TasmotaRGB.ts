import { DeviceType } from "../Enums/DeviceType";
import { MQTTHandler } from "../MQTTHandler";
import { IRGBDevice } from "../interfaces/IRGBDevice";
import { Color } from "../Color";

export class TasmotaRGB implements IRGBDevice {
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
	tasmotaDevId: string;

	constructor(Name: string, id: string, mh: MQTTHandler) {
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
import { Device, MQTTHandler } from "../";
import { IBrightness } from "../interfaces/Traits";
import { DeviceType, Trait } from "../Enums";

export default class ShellyRGBW2White  extends Device implements IBrightness {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Lights;
	Traits: Trait[] = [Trait.OnOff, Trait.Brightness]
	
	Status: boolean = false;
	Brightness: number = 0;

	lightenAmount: number = 20;

	mh: MQTTHandler;
	shellyDevId: string;
	outputNo: number;

	constructor(Name: string, id: string, mh: MQTTHandler) {
		super();
		
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

		if (data.ison != undefined) {
			let tmpStatus = data.ison;

			if (tmpStatus !== this.Status) {
				this.Status = tmpStatus;
				global.eventHandler.fire('change', this);
			}
		}
		
		if (data.brightness != undefined) {
			let tmpBrightness = data.brightness;

			if (tmpBrightness !== this.Brightness) {
				this.Brightness = tmpBrightness;
				global.eventHandler.fire('change', this);
			}
		}
	}

	TurnOn(): void {
		this.Status = true;
		this.mh.SendCommand(`shellies/shellyrgbw2-${this.shellyDevId}/white/${this.outputNo}/command`, 'on');
		global.eventHandler.fire('change', this);
	}
	TurnOff(): void {
		this.Status = false;
		this.mh.SendCommand(`shellies/shellyrgbw2-${this.shellyDevId}/white/${this.outputNo}/command`, 'off');
		global.eventHandler.fire('change', this);
	}
	Toggle(): void {
		this.Status ? this.TurnOff() : this.TurnOn();
	}

	SetBrightness(value: number): void {
		this.Brightness = value;
		this.mh.SendCommand(`shellies/shellyrgbw2-${this.shellyDevId}/white/${this.outputNo}/set`, JSON.stringify({brightness: value, turn: 'on'}));
		global.eventHandler.fire('change', this);
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
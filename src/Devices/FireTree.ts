import { Device, MQTTHandler } from "../";
import { IBrightness } from "../interfaces/Traits";
import { DeviceType, Trait } from "../Enums";

export default class FireTree  extends Device implements IBrightness {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Lights;
	Traits: Trait[] = [Trait.OnOff, Trait.Brightness]
	
	Status: boolean = false;
	Brightness: number = 0;

	lightenAmount: number = 20;

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
		this.mh.Subscribe(`${this.devId}/brightness`, this.onMQTTBrightness.bind(this));
	}

	onMQTTStatus(payload: string): void {
		let tmpStatus = false;
		if (payload.toString() == 'on') tmpStatus = true;

		if (tmpStatus !== this.Status) {
			this.Status = tmpStatus;
			global.eventHandler.fire('change', this);
		}
	}
	onMQTTBrightness(payload: string): void {
		let tmpB: number = Math.floor(parseInt(payload) / 255 * 100);

		if (tmpB !== this.Brightness) {
			this.Brightness = tmpB;
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

	SetBrightness(value: number): void {
		this.Brightness = value;
		this.mh.SendCommand(`${this.devId}/cmd/brightness`, Math.floor(value/100*255).toString());
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
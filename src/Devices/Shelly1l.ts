import { IOnOff } from "../interfaces/Traits/IOnOff";
import { Device } from "../Device";
import { DeviceType } from "../Enums/DeviceType";
import { MQTTHandler } from "../MQTTHandler";
import { Trait } from "../Enums/Trait";

export class Shelly1l  extends Device implements IOnOff {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Lights;
	Status: boolean = false;
	Traits: Trait[] = [Trait.OnOff];

	mh: MQTTHandler;
	shellyDevId: string;

	//Defaults
	aog_Type: string = 'action.devices.types.LIGHT';
	aog_Traits: string[] = ['action.devices.traits.OnOff'];
	aog_Attributes: any = {};

	constructor(Name: string, id: string, mh: MQTTHandler) {
		super();
		
		this.Name = Name;
		this._id = id;
		this.mh = mh;
	}
	Run(): void {
		this.mh.Subscribe(`shellies/shelly1l-${this.shellyDevId}/relay/0`, this.onMQTT.bind(this))
		this.mh.Subscribe(`shellies/shelly1l-${this.shellyDevId}/input/0`, payload => this.onMQTTInput(0, payload));
		this.mh.Subscribe(`shellies/shelly1l-${this.shellyDevId}/input/1`, payload => this.onMQTTInput(1, payload));
	}

	onMQTT(payload: string) {
		let tmpStatus = false;
		if (payload.toString() == 'on') tmpStatus = true;

		if (tmpStatus !== this.Status) {
			this.Status = tmpStatus;
			global.eventHandler.fire('change', this);
		}
	}

	onMQTTInput(number: number, payload: string) {
		global.eventHandler.fire('input', this, {
			inputNumber: number,
			inputStatus: payload === '1'
		});
	}
 
	TurnOn(): void {
		this.Status = true;
		this.mh.SendCommand(`shellies/shelly1l-${this.shellyDevId}/relay/0/command`, 'on');
		global.eventHandler.fire('change', this);
	}
	TurnOff(): void {
		this.Status = false;
		this.mh.SendCommand(`shellies/shelly1l-${this.shellyDevId}/relay/0/command`, 'off');
		global.eventHandler.fire('change', this);
	}
	Toggle(): void {
		this.Status ? this.TurnOff() : this.TurnOn();
	}
}
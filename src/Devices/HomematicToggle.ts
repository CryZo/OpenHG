import { Device, MQTTHandler } from "..";
import { DeviceType, Trait } from "../Enums";
import { IOnOff } from "../interfaces/Traits";

export default class HomematicToggle extends Device implements IOnOff {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Lights;
	Status: boolean = false;
	Traits: Trait[] = [Trait.OnOff];

	mh: MQTTHandler;
	channelName: string;

	constructor(Name: string, id: string, mh: MQTTHandler) {
		super();
		
		this.Name = Name;
		this._id = id;
		this.mh = mh;

	}
	Run(): void {
		this.mh.Subscribe(`hm/status/${this.channelName}/STATE`, this.onMQTT.bind(this))
	}

	onMQTT(payload: string) {
		let tmpStatus = false;
		if (payload.toString() == '1') tmpStatus = true;

		if (tmpStatus !== this.Status) {
			this.Status = tmpStatus;
			global.eventHandler.fire('change', this);
		}
	}
 
	TurnOn(): void {
		this.Status = true;
		this.mh.SendCommand(`hm/set/${this.channelName}/STATE`, '1');
		global.eventHandler.fire('change', this);
	}
	TurnOff(): void {
		this.Status = false;
		this.mh.SendCommand(`hm/set/${this.channelName}/STATE`, '0');
		global.eventHandler.fire('change', this);
	}
	Toggle(): void {
		this.Status ? this.TurnOff() : this.TurnOn();
	}
}

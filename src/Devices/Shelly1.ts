import { IToggleDevice } from "../interfaces/IToggleDevice";
import { DeviceType } from "../Enums/DeviceType";
import { MQTTHandler } from "../MQTTHandler";

export class Shelly1 implements IToggleDevice {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Toggle;
	Status: boolean = false;

	mh: MQTTHandler;
	shellyDevId: string;

	//Defaults
	aog_Type: string = 'action.devices.types.LIGHT';
	aog_Traits: string[] = ['action.devices.traits.OnOff'];
	aog_Attributes: any = {};

	constructor(Name: string, id: string, mh: MQTTHandler) {
		this.Name = Name;
		this._id = id;
		this.mh = mh;

	}
	Run(): void {
		this.mh.Subscribe(`shellies/shelly1-${this.shellyDevId}/relay/0`, this.onMQTT.bind(this))
	}

	onMQTT(payload: string) {
		if (payload.toString() == 'on') this.Status = true;
		else this.Status = false;
	}
 
	TurnOn(): void {
		this.Status = true;
		this.mh.SendCommand(`shellies/shelly1-${this.shellyDevId}/relay/0/command`, 'on');
	}
	TurnOff(): void {
		this.Status = false;
		this.mh.SendCommand(`shellies/shelly1-${this.shellyDevId}/relay/0/command`, 'off');
	}
	Toggle(): void {
		this.Status ? this.TurnOff() : this.TurnOn();
	}
}
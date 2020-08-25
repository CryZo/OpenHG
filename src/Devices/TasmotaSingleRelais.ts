import { DeviceType } from "../Enums/DeviceType";
import { MQTTHandler } from "../MQTTHandler";
import { IToggleDevice } from "../interfaces/IToggleDevice";

export class TasmotaSingleRelais implements IToggleDevice {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Toggle;
	Status: boolean = false;

	mh: MQTTHandler;
	tasmotaDevId: string;

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
		this.mh.Subscribe(`stat/${this.tasmotaDevId}/RESULT`, this.onMQTT.bind(this));
		this.mh.Subscribe(`stat/${this.tasmotaDevId}/STATE`, this.onMQTT.bind(this));
	}

	onMQTT(payload: string): void {
		let data: any = JSON.parse(payload.toString());
		if (data.POWER == 'ON') {
			this.Status = true;
		}
		else {
			this.Status = false;
		}
	}

	TurnOn(): void {
		this.Status = true;
		this.mh.SendCommand(`cmnd/${this.tasmotaDevId}/POWER`, 'ON');
	}
	TurnOff(): void {
		this.Status = false;
		this.mh.SendCommand(`cmnd/${this.tasmotaDevId}/POWER`, 'OFF');
	}
	Toggle(): void {
		this.Status = !this.Status;
		this.mh.SendCommand(`cmnd/${this.tasmotaDevId}/POWER`, 'TOGGLE');
	}
}
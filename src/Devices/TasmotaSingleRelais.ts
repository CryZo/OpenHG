import { Device, MQTTHandler } from "../";
import { IOnOff } from "../interfaces/Traits";
import { DeviceType, Trait } from "../Enums";

export default class TasmotaSingleRelais  extends Device implements IOnOff {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Lights;
	Traits: Trait[] = [Trait.OnOff]
	
	Status: boolean = false;

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
}
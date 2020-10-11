import { DeviceType } from "../Enums/DeviceType";
import { MQTTHandler } from "../MQTTHandler";
import { IBlinds } from "../interfaces/IBlinds";
import { BlindStatus } from "../Enums/BlindStatus";

export class Shelly25Shutter implements IBlinds {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Blinds;
	Status: BlindStatus = BlindStatus.Stop;
	Position: number = 0;

	//Defaults
	//TODO
	aog_Type: string = 'action.devices.types.LIGHT';
	aog_Traits: string[] = ['action.devices.traits.OnOff', 'action.devices.traits.ColorSetting']; //TODO
	aog_Attributes: null;

	mh: MQTTHandler;
	shellyDevId: string;

	constructor(Name: string, id: string, mh: MQTTHandler) {
		this.Name = Name;
		this._id = id;
		this.mh = mh;
	}
	Run(): void {
		this.mh.Subscribe(`shellies/shellyswitch25-${this.shellyDevId}/roller/0`, this.onMQTTStatus.bind(this));
		this.mh.Subscribe(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/pos`, this.onMQTTPos.bind(this));
	}

	onMQTTStatus(payload: string): void {
		switch (payload) {
			case 'open':
				this.Status = BlindStatus.MovingUp;
				return;

			case 'close':
				this.Status = BlindStatus.MovingDown;
				return;

			case 'stop':
				this.Status = BlindStatus.Stop;
				return;
		}
	}
	onMQTTPos(payload: string): void {
		if (!isNaN(parseInt(payload))) {
			this.Position = parseInt(payload);
		}
	}

	TurnUp(): void {
		this.Status = BlindStatus.MovingUp;
		this.mh.SendCommand(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/command`, 'open');
	}
	TurnDown(): void {
		this.Status = BlindStatus.MovingDown;
		this.mh.SendCommand(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/command`, 'close');
	}
	Stop(): void {
		this.Status = BlindStatus.Stop;
		this.mh.SendCommand(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/command`, 'stop');
	}

	SetPosition(value: number): void {
		this.Position = value;
		this.mh.SendCommand(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/command/pos`, `${value}`);
	}
}
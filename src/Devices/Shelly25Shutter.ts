import { IDevice } from "../interfaces/DeviceTypes/IDevice";
import { IOpenClose } from "../interfaces/Traits/IOpenClose";
import { DeviceType } from "../Enums/DeviceType";
import { MQTTHandler } from "../MQTTHandler";
import { BlindStatus } from "../Enums/BlindStatus";
import { Trait } from "../Enums/Trait";

export class Shelly25Shutter implements IDevice, IOpenClose {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Blinds;
	MovementStatus: BlindStatus = BlindStatus.Stop;
	Position: number = 0;
	Traits: Trait[] = [Trait.OpenClose];

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
		let tmpStatus: BlindStatus = null;
		switch (payload) {
			case 'open':
				tmpStatus = BlindStatus.MovingUp;
				break;

			case 'close':
				tmpStatus = BlindStatus.MovingDown;
				break;

			case 'stop':
				tmpStatus = BlindStatus.Stop;
				break;
		}

		if (tmpStatus !== this.MovementStatus) {
			this.MovementStatus = tmpStatus;
			global.eventHandler.fire('change', this);
		}
	}
	onMQTTPos(payload: string): void {
		let tmpPos: number;

		if (!isNaN(parseInt(payload))) {
			tmpPos = parseInt(payload);
		}

		if (tmpPos !== this.Position) {
			this.Position = tmpPos;
			global.eventHandler.fire('change', this);
		}
	}

	TurnUp(): void {
		this.MovementStatus = BlindStatus.MovingUp;
		this.mh.SendCommand(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/command`, 'open');
		global.eventHandler.fire('change', this);
	}
	TurnDown(): void {
		this.MovementStatus = BlindStatus.MovingDown;
		this.mh.SendCommand(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/command`, 'close');
		global.eventHandler.fire('change', this);
	}
	Stop(): void {
		this.MovementStatus = BlindStatus.Stop;
		this.mh.SendCommand(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/command`, 'stop');
		global.eventHandler.fire('change', this);
	}

	SetPosition(value: number): void {
		this.Position = value;
		this.mh.SendCommand(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/command/pos`, `${value}`);
		global.eventHandler.fire('change', this);
	}
}
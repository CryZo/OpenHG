import { Device, MQTTHandler } from "..";
import { IOpenClose, IPosition } from "../interfaces/Traits";
import { BlindStatus, DeviceType, Trait } from "../Enums";

export default class HomematicShutter  extends Device implements IOpenClose, IPosition {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Blinds;
	Traits: Trait[] = [Trait.OpenClose, Trait.Position];

	MovementStatus: BlindStatus = BlindStatus.Stop;
	Position: number = 0;

	mh: MQTTHandler;
	channelName: string;

	constructor(Name: string, id: string, mh: MQTTHandler) {
		super();
		
		this.Name = Name;
		this._id = id;
		this.mh = mh;
	}

	Run(): void {
		this.mh.Subscribe(`hm/status/${this.channelName}/ACTIVITY_STATE`, this.onMQTTStatus.bind(this));
		this.mh.Subscribe(`hm/status/${this.channelName}/LEVEL`, this.onMQTTPosition.bind(this));
	}

	onMQTTStatus(payload: string): void {
		let tmpStatus: BlindStatus = null;
		switch (payload) {
			case '1':
				tmpStatus = BlindStatus.Opening;
				break;

			case '2':
				tmpStatus = BlindStatus.Closing;
				break;

			case '3':
				tmpStatus = BlindStatus.Stop;
				break;
		}

		if (tmpStatus !== this.MovementStatus) {
			this.MovementStatus = tmpStatus;
			global.eventHandler.fire('change', this);
		}
	}

	onMQTTPosition(payload: string): void {
		let tmpPos: number;

		if (!isNaN(parseInt(payload))) {
			tmpPos = Math.floor(parseInt(payload) * 100);

			if (tmpPos !== this.Position) {
				this.Position = tmpPos;
				global.eventHandler.fire('change', this);
			}
		}
	}

	Open(): void {
		this.MovementStatus = BlindStatus.Opening;
		this.mh.SendCommand(`hm/set/${this.channelName}/LEVEL`, '1');
		global.eventHandler.fire('change', this);
	}
	Close(): void {
		this.MovementStatus = BlindStatus.Closing;
		this.mh.SendCommand(`hm/set/${this.channelName}/LEVEL`, '0');
		global.eventHandler.fire('change', this);
	}
	Stop(): void {
		this.MovementStatus = BlindStatus.Stop;
		this.mh.SendCommand(`hm/set/${this.channelName}/STOP`, '1');
		global.eventHandler.fire('change', this);
	}

	SetPosition(value: number): void {
		this.Position = value;
		this.mh.SendCommand(`hm/set/${this.channelName}/LEVEL`, `${value / 100}`);
		global.eventHandler.fire('change', this);
	}
}

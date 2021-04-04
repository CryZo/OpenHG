import { Device, MQTTHandler } from "../";
import { IOpenClose, ITemperature, IPower, IEnergy } from "../interfaces/Traits";
import { BlindStatus, DeviceType, Trait } from "../Enums";

export default class Shelly25Shutter  extends Device implements IOpenClose, ITemperature, IPower, IEnergy {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Blinds;
	Traits: Trait[] = [Trait.OpenClose, Trait.Position, Trait.Temperature, Trait.Power, Trait.Energy];

	MovementStatus: BlindStatus = BlindStatus.Stop;
	Position: number = 0;

	Temperature: number = 0;
	IsRoomTemperature: boolean = false;

	Power: number = 0;
	Energy: number = 0;

	mh: MQTTHandler;
	shellyDevId: string;

	constructor(Name: string, id: string, mh: MQTTHandler) {
		super();
		
		this.Name = Name;
		this._id = id;
		this.mh = mh;
	}
	Run(): void {
		this.mh.Subscribe(`shellies/shellyswitch25-${this.shellyDevId}/roller/0`, this.onMQTTStatus.bind(this));
		this.mh.Subscribe(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/pos`, this.onMQTTPos.bind(this));
		this.mh.Subscribe(`shellies/shellyswitch25-${this.shellyDevId}/temperature`, this.onMQTTTemp.bind(this));
		this.mh.Subscribe(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/power`, this.onMQTTPower.bind(this));
		this.mh.Subscribe(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/energy`, this.onMQTTEnergy.bind(this));
	}

	onMQTTStatus(payload: string): void {
		let tmpStatus: BlindStatus = null;
		switch (payload) {
			case 'open':
				tmpStatus = BlindStatus.Opening;
				break;

			case 'close':
				tmpStatus = BlindStatus.Closing;
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

			if (tmpPos !== this.Position) {
				this.Position = tmpPos;
				global.eventHandler.fire('change', this);
			}
		}
	}
	onMQTTTemp(payload: string): void {
		let tmpTemp: number;

		if (!isNaN(parseInt(payload))) {
			tmpTemp = parseInt(payload);

			if (tmpTemp !== this.Temperature) {
				this.Temperature = tmpTemp;
				global.eventHandler.fire('change', this);
			}
		}
	}
	onMQTTPower(payload: string): void {
		let tmpPower: number;

		if (!isNaN(parseInt(payload))) {
			tmpPower = parseInt(payload);

			if (tmpPower !== this.Power) {
				this.Power = tmpPower;
				global.eventHandler.fire('change', this);
			}
		}
	}
	onMQTTEnergy(payload: string): void {
		let tmpEnergy: number;

		if (!isNaN(parseInt(payload))) {
			tmpEnergy = parseInt(payload) / 60;//m to h

			if (tmpEnergy !== this.Energy) {
				this.Energy = tmpEnergy;
				global.eventHandler.fire('change', this);
			}
		}
	}

	Open(): void {
		this.MovementStatus = BlindStatus.Opening;
		this.mh.SendCommand(`shellies/shellyswitch25-${this.shellyDevId}/roller/0/command`, 'open');
		global.eventHandler.fire('change', this);
	}
	Close(): void {
		this.MovementStatus = BlindStatus.Closing;
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
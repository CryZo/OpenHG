import { Device } from "..";
import { DeviceType, Trait } from "../Enums";
import { IOnOff } from "../interfaces/Traits";
import Samsung, { APPS, KEYS } from 'samsung-tv-control'

export default class SamsungSmartTv extends Device implements IOnOff {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Multimedia;
	Status: boolean = false;
	Traits: Trait[] = [Trait.OnOff];

	host: string;
	mac: string;
	token?: string;

	control: Samsung;

	constructor(Name: string, id: string) {
		super();
		
		this.Name = Name;
		this._id = id;
	}

	public async Run() {
		this.control = new Samsung({
			ip: this.host,
			mac: this.mac,
			nameApp: 'OpenHG',
			token: this.token
		});
		
		if (!this.token) {
			await this.control.turnOn();
			await this.control.isAvailable();
		  
			let token = await this.control.getTokenPromise();
			console.log('$$ token:', token);
		}
	}

	public TurnOn(): void {
		this.Status = true;
		this.control.turnOn()
		global.eventHandler.fire('change', this);
	}
	public TurnOff(): void {
		this.Status = false;
		this.control.sendKey(KEYS.KEY_POWER);
		global.eventHandler.fire('change', this);
	}
	public Toggle(): void {
		this.Status ? this.TurnOff() : this.TurnOn();
	}
}
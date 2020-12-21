import { Device } from "../Device";
import { IOnOff } from "../interfaces/Traits/IOnOff";
import { DeviceType } from "../Enums/DeviceType";
import * as https from "https";
import * as http from "http";
import { Trait } from "../Enums/Trait";

export class RestToggle  extends Device implements IOnOff {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Lights;
	Status: boolean = false;
	Traits: Trait[] = [Trait.OnOff];

	OnUrl: string;
	OffUrl: string;

	//Defaults
	aog_Type: string = 'action.devices.types.LIGHT';
	aog_Traits: string[] = ['action.devices.traits.OnOff'];
	aog_Attributes: any = {};

	constructor(Name: string, id: string) {
		super();
		
		this.Name = Name;
		this._id = id;
	}
	Run(): void {
	}
 
	TurnOn(): void {
		this.Status = true;
		this.SendCommand(this.OnUrl);
		global.eventHandler.fire('change', this);
	}
	TurnOff(): void {
		this.Status = false;
		this.SendCommand(this.OffUrl);
		global.eventHandler.fire('change', this);
	}
	Toggle(): void {
		this.Status ? this.TurnOff() : this.TurnOn();
	}

	SendCommand(url: string): void {
		try {
			if (/^https/g.test(url))
				https.get(url);
			else if (/^http/g.test(url))
				http.get(url);
		}
		catch {

		}
	}
}
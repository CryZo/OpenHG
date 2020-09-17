import { IToggleDevice } from "../interfaces/IToggleDevice";
import { DeviceType } from "../Enums/DeviceType";
import * as https from "https";

export class RestToggle implements IToggleDevice {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Toggle;
	Status: boolean = false;

	OnUrl: string = '';
	OffUrl: string = '';

	//Defaults
	aog_Type: string = 'action.devices.types.LIGHT';
	aog_Traits: string[] = ['action.devices.traits.OnOff'];
	aog_Attributes: any = {};

	constructor(Name: string, id: string) {
		this.Name = Name;
		this._id = id;
	}
	Run(): void {
	}
 
	TurnOn(): void {
		this.Status = true;
		this.SendCommand(this.OnUrl);
	}
	TurnOff(): void {
		this.Status = false;
		this.SendCommand(this.OffUrl);
	}
	Toggle(): void {
		this.Status ? this.TurnOff() : this.TurnOn();
	}

	SendCommand(url: string): void {
		https.get(url);
	}
}
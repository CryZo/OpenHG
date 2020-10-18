import { IToggleDevice } from "../interfaces/IToggleDevice";
import { DeviceType } from "../Enums/DeviceType";
import * as https from "https";
import * as http from "http";

export class HomematicToggle implements IToggleDevice {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Toggle;
	Status: boolean = false;

	ApiURL: string;
	IseId: number;

	//Defaults
	aog_Type: string = 'action.devices.types.LIGHT';
	aog_Traits: string[] = ['action.devices.traits.OnOff'];
	aog_Attributes: any = {};

	constructor(Name: string, id: string) {
		this.Name = Name;
		this._id = id;
	}
	Run(): void {
		setInterval(()=>{
			let url = `${this.ApiURL}/state.cgi?datapoint_id=${this.IseId}`;
			let callback = (res: http.IncomingMessage) => {
				let data = '';

				res.on('data', (chunk) => {
					data += chunk;
				});
			  
				res.on('end', () => {
					let tmpStatus = data.includes(`value='true'`);
					
					if (tmpStatus !== this.Status) {
						this.Status = tmpStatus;
						global.eventHandler.fire('change', this);
					}
				});
			}

			if (/^https/g.test(url))
				https.get(url, callback);
			else if (/^http/g.test(url))
				http.get(url, callback);
		}, 5000)
	}
 
	TurnOn(): void {
		this.Status = true;
		this.SendCommand(`${this.ApiURL}/statechange.cgi?ise_id=${this.IseId}&new_value=true`);
		global.eventHandler.fire('change', this);
	}
	TurnOff(): void {
		this.Status = false;
		this.SendCommand(`${this.ApiURL}/statechange.cgi?ise_id=${this.IseId}&new_value=false`);
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
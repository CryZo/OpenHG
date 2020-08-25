import { IToggleDevice } from "../interfaces/IToggleDevice";
import { DeviceType } from "../Enums/DeviceType";

import * as fs from 'fs';

export class ToggleDummyFromFile implements IToggleDevice {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Toggle;
	Status: boolean = false;

	filePath: string;

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
			fs.readFile(this.filePath, 'utf8', (err, data) => {
				if (err) return console.error(err);
				
				if (data == '1') this.Status = true;
				else this.Status = false;
			});
		}, 5000);
	}
 
	TurnOn(): void {
		this.Status = true;
		this.WriteToFile('1');
	}
	TurnOff(): void {
		this.Status = false;
		this.WriteToFile('0');
	}
	Toggle(): void {
		this.Status ? this.TurnOff() : this.TurnOn();
	}

	WriteToFile(content: string):void {
		fs.writeFile(this.filePath, content, 'utf8', function (err) {
			if (err) return console.error(err);
		});
	}
}
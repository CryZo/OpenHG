import { DeviceType } from "../Enums/DeviceType";
import { IBlinds } from "../interfaces/IBlinds";
import { BlindStatus } from "../Enums/BlindStatus";

import * as fs from 'fs';

export class BlindsDummyFromFile implements IBlinds {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Blinds;
	Status: BlindStatus = BlindStatus.Down;

	filePath: string;

	//Defaults
	aog_Type: string = '';
	aog_Traits: string[] = [''];
	aog_Attributes: any = {};

	constructor(Name: string, id: string) {
		this.Name = Name;
		this._id = id;
	}

	Run(): void {
		setInterval(()=>{
			fs.readFile(this.filePath, 'utf8', (err, data) => {
				if (err) return console.error(err);
				
				if (data == '0') this.Status = BlindStatus.Up;
				else this.Status = BlindStatus.Down;
			});
		}, 5000);
	}
 
	TurnUp(): void {
		this.Status = BlindStatus.Up;
		this.WriteToFile('0');
	}
	TurnDown(): void {
		this.Status = BlindStatus.Down;
		this.WriteToFile('1');
	}
	Toggle(): void {
		this.Status == BlindStatus.Up ? this.TurnDown() : this.TurnUp();
	}

	WriteToFile(content: string):void {
		fs.writeFile(this.filePath, content, 'utf8', function (err) {
			if (err) return console.error(err);
		});
	}
}
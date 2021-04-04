import { DeviceCollection, Room } from "./";
import ICollection from "./interfaces/ICollection";

export default class RoomCollection implements ICollection {
	Items: Room[] = [];
	
	Add(room: Room): void {
		this.Items.push(room);
	}

	GetById(id: string): Room {
		for( let i in this.Items) {
			if (this.Items[i]._id == id) {
				return this.Items[i];
			}
		}

		//Not found
		throw 'Not found!'
	}

	GetDevices(): DeviceCollection {
		let out = new DeviceCollection();

		for (let i in this.Items) {
			for (let j in this.Items[i].Devices.Items) {
				out.Add(this.Items[i].Devices.Items[j]);
			}
		}

		return out;
	}

	stringify(): string {
		let output: any[] = [];

		for (let i in this.Items) {
			let curRoom = this.Items[i];
			output.push(JSON.parse(curRoom.stringify()));
		}

		return JSON.stringify(output);
	}
}
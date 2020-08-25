import { Room } from "./Room";
import { ICollection } from "./interfaces/ICollection";
import { DeviceCollection } from "./DeviceCollection";

export class RoomCollection implements ICollection {
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
}
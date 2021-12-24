import { Device } from "./";
import { Trait, DeviceType } from "./Enums";
import ICollection from "./interfaces/ICollection";

export default class DeviceCollection implements ICollection {
	Items: Device[] = [];

	Add(dev: Device): void {
		this.Items.push(dev);
	}

	GetById(id: string): Device {
		for (let i in this.Items) {
			if (this.Items[i]._id == id) {
				return this.Items[i];
			}
		}

		//Not found
		throw 'Not found!'
	}

	GetByTrait(trait: Trait): DeviceCollection {
		let ret = new DeviceCollection();

		for (let i in this.Items) {
			if (this.Items[i].Traits.includes(trait)) {
				ret.Add(this.Items[i]);
			}
		}

		return ret;
	}

	GetByType(type: DeviceType): DeviceCollection {
		let ret = new DeviceCollection();

		for (let i in this.Items) {
			if (this.Items[i].Type.includes(type)) {
				ret.Add(this.Items[i]);
			}
		}

		return ret;
	}
}
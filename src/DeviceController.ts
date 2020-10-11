import { Shelly1 } from "./Devices/Shelly1";
import { MQTTHandler } from "./MQTTHandler";
import { TasmotaRGB } from "./Devices/TasmotaRGB";
import { TasmotaSingleRelais } from "./Devices/TasmotaSingleRelais";
import { RestToggle } from "./Devices/RestToggle";
import { ShellyRGBW2Color } from "./Devices/ShellyRGBW2Color";
import { ShellyRGBW2White } from "./Devices/ShellyRGBW2White";
import { HomematicToggle } from "./Devices/HomematicToggle";
import { Shelly25Shutter } from "./Devices/Shelly25Shutter";

export class DeviceController {
	mqtt: MQTTHandler;

	constructor(mqtt: MQTTHandler) {
		this.mqtt = mqtt;
	}

	GetClass (className: string, devName: string, id: string) {
		switch (className) {
			case 'Shelly1':
				return new Shelly1(devName, id, this.mqtt);
			case 'ShellyRGBW2Color':
				return new ShellyRGBW2Color(devName, id, this.mqtt);
			case 'TasmotaRGB':
				return new TasmotaRGB(devName, id, this.mqtt);
			case 'ShellyRGBW2White':
				return new ShellyRGBW2White(devName, id, this.mqtt);
			case 'Shelly25Shutter':
				return new Shelly25Shutter(devName, id, this.mqtt);
			case 'TasmotaSingleRelais':
				return new TasmotaSingleRelais(devName, id, this.mqtt);
			case 'RestToggle':
				return new RestToggle(devName, id);
			case 'HomematicToggle':
				return new HomematicToggle(devName, id);

			default:
				throw 'Device class not found!';
		}
	}
}
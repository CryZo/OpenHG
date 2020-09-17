import { Shelly1 } from "./Devices/Shelly1";
import { MQTTHandler } from "./MQTTHandler";
import { TasmotaRGB } from "./Devices/TasmotaRGB";
import { TasmotaSingleRelais } from "./Devices/TasmotaSingleRelais";
import { ToggleDummyFromFile } from "./Devices/ToggleDummyFromFile";
import { BlindsDummyFromFile } from "./Devices/BlindsDummyFromFile";
import { RestToggle } from "./Devices/RestToggle";

export class DeviceController {
	mqtt: MQTTHandler;

	constructor(mqtt: MQTTHandler) {
		this.mqtt = mqtt;
	}

	GetClass (className: string, devName: string, id: string) {
		switch (className) {
			case 'Shelly1':
				return new Shelly1(devName, id, this.mqtt);
			case 'TasmotaRGB':
				return new TasmotaRGB(devName, id, this.mqtt);
			case 'TasmotaSingleRelais':
				return new TasmotaSingleRelais(devName, id, this.mqtt);
			case 'ToggleDummyFromFile':
				return new ToggleDummyFromFile(devName, id);
			case 'BlindsDummyFromFile':
				return new BlindsDummyFromFile(devName, id);
			case 'RestToggle':
				return new RestToggle(devName, id);

			default:
				throw 'Device class not found!';
		}
	}
}
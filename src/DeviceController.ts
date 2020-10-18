import { Shelly1 } from "./Devices/Shelly1";
import { MQTTHandler } from "./MQTTHandler";
import { TasmotaRGB } from "./Devices/TasmotaRGB";
import { TasmotaSingleRelais } from "./Devices/TasmotaSingleRelais";
import { RestToggle } from "./Devices/RestToggle";
import { ShellyRGBW2Color } from "./Devices/ShellyRGBW2Color";
import { ShellyRGBW2White } from "./Devices/ShellyRGBW2White";
import { HomematicToggle } from "./Devices/HomematicToggle";
import { Shelly25Shutter } from "./Devices/Shelly25Shutter";
import { IDevice } from "./interfaces/IDevice";
import { DeviceType } from "./Enums/DeviceType";
import { IToggleDevice } from "./interfaces/IToggleDevice";
import { IRGBDevice } from "./interfaces/IRGBDevice";
import { IDimDevice } from "./interfaces/IDimDevice";
import { IBlinds } from "./interfaces/IBlinds";
import { Color } from "./Color";

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

	static HandleCommand(dev: IDevice, cmd: string) {

		switch (dev.Type) {
			case DeviceType.Toggle:
				{
					let castedDev = dev as IToggleDevice;

					if (cmd == 'on') castedDev.TurnOn();
					else if (cmd == 'off') castedDev.TurnOff();
					else if (cmd == 'toggle') castedDev.Toggle();
					else throw `Can't recognize parameter "${cmd}"!`
					break;
				}

			case DeviceType.RGB:
				{
					let castedDev = dev as IRGBDevice;

					if (cmd == 'on') castedDev.TurnOn();
					else if (cmd == 'off') castedDev.TurnOff();
					else if (cmd == 'toggle') castedDev.Toggle();

					else if (cmd == 'lighten') castedDev.Lighten();
					else if (cmd == 'darken') castedDev.Darken();

					else if (cmd.length == 6) castedDev.SetColor(Color.Parse(cmd));

					else throw `Can't recognize parameter "${cmd}"!`
					break;
				}

			case DeviceType.Dimmer:
				{
					let castedDev = dev as IDimDevice;

					if (cmd == 'on') castedDev.TurnOn();
					else if (cmd == 'off') castedDev.TurnOff();
					else if (cmd == 'toggle') castedDev.Toggle();

					else if (cmd == 'lighten') castedDev.Lighten();
					else if (cmd == 'darken') castedDev.Darken();

					else if (parseInt(cmd) >= 0 && parseInt(cmd) <= 100)
						castedDev.SetBrightness(parseInt(cmd));

					else throw `Can't recognize parameter "${cmd}"!`
					break;
				}

			case DeviceType.Blinds:
				{
					let castedDev = dev as IBlinds;

					if (cmd == 'up') castedDev.TurnUp();
					else if (cmd == 'down') castedDev.TurnDown();
					else if (cmd == 'stop') castedDev.Stop();

					else if (parseInt(cmd) >= 0 && parseInt(cmd) <= 100)
						castedDev.SetPosition(parseInt(cmd));

					else throw `Can't recognize parameter "${cmd}"!`
					break;
				}
		}
	}
}
import { Color } from "./Color";

import { Shelly1 } from "./Devices/Shelly1";
import { MQTTHandler } from "./MQTTHandler";
import { TasmotaRGB } from "./Devices/TasmotaRGB";
import { TasmotaSingleRelais } from "./Devices/TasmotaSingleRelais";
import { RestToggle } from "./Devices/RestToggle";
import { ShellyRGBW2Color } from "./Devices/ShellyRGBW2Color";
import { ShellyRGBW2White } from "./Devices/ShellyRGBW2White";
import { HomematicToggle } from "./Devices/HomematicToggle";
import { Shelly25Shutter } from "./Devices/Shelly25Shutter";

import { IDevice } from "./interfaces/DeviceTypes/IDevice";
import { IOnOff } from "./interfaces/Traits/IOnOff";
import { IRGB } from "./interfaces/Traits/IRGB";
import { IBrightness } from "./interfaces/Traits/IBrightness";
import { IOpenClose } from "./interfaces/Traits/IOpenClose";
import { Trait } from "./Enums/Trait";
import { IPosition } from "./interfaces/Traits/IPosition";

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
		if(dev.Traits.includes(Trait.OnOff))
		{
			let castedDev = dev as IOnOff;

			if (cmd == 'on') castedDev.TurnOn();
			else if (cmd == 'off') castedDev.TurnOff();
			else if (cmd == 'toggle') castedDev.Toggle();
		}

		if(dev.Traits.includes(Trait.RGB))
		{
			let castedDev = dev as IRGB;

			if (cmd == 'lightenColor') castedDev.LightenColor();
			else if (cmd == 'darkenColor') castedDev.DarkenColor();

			else if (cmd.length == 6) castedDev.SetColor(Color.Parse(cmd));
		}

		if(dev.Traits.includes(Trait.Brightness))
		{
			let castedDev = dev as IBrightness;

			if (cmd == 'lighten') castedDev.Lighten();
			else if (cmd == 'darken') castedDev.Darken();

			else if (parseInt(cmd) >= 0 && parseInt(cmd) <= 100)
				castedDev.SetBrightness(parseInt(cmd));
		}

		if(dev.Traits.includes(Trait.OpenClose))
		{
			let castedDev = dev as IOpenClose;

			//TODO Rename me
			if (cmd == 'up') castedDev.TurnUp();
			else if (cmd == 'down') castedDev.TurnDown();
			else if (cmd == 'stop') castedDev.Stop();
		}

		if(dev.Traits.includes(Trait.Position))
		{
			let castedDev = dev as IPosition;

			if (parseInt(cmd) >= 0 && parseInt(cmd) <= 100)
				castedDev.SetPosition(parseInt(cmd));
		}
	}
}
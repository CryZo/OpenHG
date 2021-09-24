import { Color, Device, MQTTHandler } from "./";
import { ChaserHeater, FireTree, HomematicShutter, HomematicThermometer, HomematicToggle, RestToggle, Shelly1, Shelly1l, Shelly25Shutter, ShellyDW2, ShellyRGBW2Color, ShellyRGBW2ColorAndWhite, ShellyRGBW2White, TasmotaRGB, TasmotaSingleRelais } from "./Devices";
import { IOnOff, IRGB, IBrightness, IOpenClose, IPosition, ITemperatureSetting } from "./interfaces/Traits/";
import { Trait } from "./Enums";
import DenonAvr from "./Devices/DenonAvr";

export default class DeviceController {
	mqtt: MQTTHandler;

	constructor(mqtt: MQTTHandler) {
		this.mqtt = mqtt;
	}

	GetClass (className: string, devName: string, id: string) {
		switch (className) {
			case 'Shelly1':
				return new Shelly1(devName, id, this.mqtt);
			case 'Shelly1l':
				return new Shelly1l(devName, id, this.mqtt);
			case 'ShellyRGBW2Color':
				return new ShellyRGBW2Color(devName, id, this.mqtt);
			case 'ShellyRGBW2ColorAndWhite':
				return new ShellyRGBW2ColorAndWhite(devName, id, this.mqtt);
			case 'TasmotaRGB':
				return new TasmotaRGB(devName, id, this.mqtt);
			case 'ShellyRGBW2White':
				return new ShellyRGBW2White(devName, id, this.mqtt);
			case 'Shelly25Shutter':
				return new Shelly25Shutter(devName, id, this.mqtt);
			case 'ShellyDW2':
				return new ShellyDW2(devName, id, this.mqtt);
			case 'TasmotaSingleRelais':
				return new TasmotaSingleRelais(devName, id, this.mqtt);
			case 'RestToggle':
				return new RestToggle(devName, id);
			case 'HomematicToggle':
				return new HomematicToggle(devName, id, this.mqtt);
			case 'HomematicThermometer':
				return new HomematicThermometer(devName, id, this.mqtt);
			case 'HomematicShutter':
				return new HomematicShutter(devName, id, this.mqtt);
			case 'ChaserHeater':
				return new ChaserHeater(devName, id, this.mqtt);
			case 'FireTree':
				return new FireTree(devName, id, this.mqtt);
			case 'DenonAvr':
				return new DenonAvr(devName, id);

			default:
				throw 'Device class not found!';
		}
	}

	static HandleCommand(dev: Device, cmd: string) {
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

			else if (cmd.toString().length == 6) castedDev.SetColor(Color.Parse(cmd.toString()));
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
			if (cmd == 'up') castedDev.Open();
			else if (cmd == 'down') castedDev.Close();
			if (cmd == 'open') castedDev.Open();
			else if (cmd == 'close') castedDev.Close();
			else if (cmd == 'stop') castedDev.Stop();
		}

		if(dev.Traits.includes(Trait.Position))
		{
			let castedDev = dev as IPosition;

			if (parseInt(cmd) >= 0 && parseInt(cmd) <= 100)
				castedDev.SetPosition(parseInt(cmd));
		}

		if(dev.Traits.includes(Trait.TemperatureSetting))
		{
			let castedDev = dev as ITemperatureSetting;

			if (parseFloat(cmd) >= 0 && parseInt(cmd) <= 100)
				castedDev.SetTemperature(parseFloat(cmd));
		}
	}
}
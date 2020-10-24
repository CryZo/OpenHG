import express from "express";
import { RoomCollection } from "./RoomCollection";
import { DeviceType } from "./Enums/DeviceType";
import { IOnOff } from "./interfaces/Traits/IOnOff";
import { IRGB } from "./interfaces/Traits/IRGB";
import { Color } from "./Color";
import { IDevice } from "./interfaces/DeviceTypes/IDevice";
import { IOpenClose } from "./interfaces/Traits/IOpenClose";
import { IBrightness } from "./interfaces/Traits/IBrightness";
import { DeviceController } from "./DeviceController";
import { Trait } from "./Enums/Trait";

//TODO Refactor me!

export class RestApi {
	model: RoomCollection;
	app: express.Express;
	server: any;
	

	constructor(model: RoomCollection) {
		this.model = model;

		this.Run();
	}

	async Run() {
		this.app = express();
		this.app.use(function (req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});

		this.app.get('/full', (req: any, res: any) => {
			res.end(this.model.stringify());
		});

		this.app.get('/controll/:dev/:status', this.HandleControl.bind(this));
		this.app.get('/control/:dev/:status', this.HandleControl.bind(this));

		this.server = this.app.listen(8081, () => {
			let host = this.server.address().address,
				port = this.server.address().port;

			console.log(`Example app listening at http://${host}:${port}`);
		})
	}

	HandleControl(req: any, res: any) {
		try {
			let dev = this.model.GetDevices().GetById(req.params.dev)

			//Apply extra params
			{
				let params: string[] = Object.keys(req.query);
				for (let i in params) {
					let curParam = params[i];
					if (dev && (<any>dev)[curParam] != null)
						(<any>dev)[curParam] = req.query[curParam];
				}
			}

			DeviceController.HandleCommand(dev, req.params.status);
		}
		catch (error) {
			res.status(400).end(error);
		}
	}

	static generateDeviceStructure(data: IDevice[]): any {//TODO Refactor me and then move me to DeviceCollection.ts
		let ret: any = {};

		for (let d in data) {
			let curDev = data[d];
			let dev: any = {};

			dev.id = curDev._id;
			dev.Name = curDev.Name;
			dev.Type = curDev.Type;

		
			if (curDev.Traits.includes(Trait.OnOff))
			{
				let castedDev = curDev as IOnOff;
				dev.Status = castedDev.Status;
				break;
			}

			if (curDev.Traits.includes(Trait.RGB))
			{
				let castedDev = curDev as IRGB;
				dev.Color = castedDev.GetColor().GetHexColor();
				break;
			}
			
			if (curDev.Traits.includes(Trait.Brightness))
			{
				let castedDev = curDev as IBrightness;
				dev.Brightness = castedDev.Brightness;
				break;
			}

			if (curDev.Traits.includes(Trait.OpenClose))
			{
				let castedDev = curDev as IOpenClose;
				dev.MovementStatus = castedDev.MovementStatus;
				dev.Position = castedDev.Position;
				break;
			}

			ret[d] = dev;
		}

		return ret;
	}
}
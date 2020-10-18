import express from "express";
import { RoomCollection } from "./RoomCollection";
import { DeviceType } from "./Enums/DeviceType";
import { IToggleDevice } from "./interfaces/IToggleDevice";
import { IRGBDevice } from "./interfaces/IRGBDevice";
import { Color } from "./Color";
import { IDevice } from "./interfaces/IDevice";
import { IBlinds } from "./interfaces/IBlinds";
import { IDimDevice } from "./interfaces/IDimDevice";
import { DeviceController } from "./DeviceController";

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
			res.end(this.model.stringify);
		});

		this.app.get('/controll/:dev/:status', this.HandleControl);
		this.app.get('/control/:dev/:status', this.HandleControl);

		this.server = this.app.listen(8081, () => {
			let host = this.server.address().address,
				port = this.server.address().port;

			console.log(`Example app listening at http://${host}:${port}`);
		})
	}

	HandleControl(req: any, res: any) {
		let output: any = {};

		try {
			//Device
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
			catch {
				//Try to query a room instead

				let room = this.model.GetById(req.params.dev);
				room.HandleCommand(req.params.status);
			}

			res.status(200).end('OK');
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

			switch (curDev.Type) {
				case DeviceType.Toggle:
					{
						let castedDev = curDev as IToggleDevice;
						dev.Status = castedDev.Status;
						break;
					}

				case DeviceType.RGB:
					{
						let castedDev = curDev as IRGBDevice;
						dev.Status = castedDev.Status;
						dev.Color = castedDev.GetColor().GetHexColor();
						break;
					}

				case DeviceType.Dimmer:
					{
						let castedDev = curDev as IDimDevice;
						dev.Status = castedDev.Status;
						dev.Brightness = castedDev.Brightness;
						break;
					}

				case DeviceType.Blinds:
					{
						let castedDev = curDev as IBlinds;
						dev.Status = castedDev.Status;
						dev.Position = castedDev.Position;
						break;
					}
			}

			ret[d] = dev;
		}

		return ret;
	}
}
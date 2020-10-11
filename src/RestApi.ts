import express from "express";
import { RoomCollection } from "./RoomCollection";
import { DeviceType } from "./Enums/DeviceType";
import { IToggleDevice } from "./interfaces/IToggleDevice";
import { IRGBDevice } from "./interfaces/IRGBDevice";
import { Color } from "./Color";
import { IDevice } from "./interfaces/IDevice";
import { IBlinds } from "./interfaces/IBlinds";
import { IDimDevice } from "./interfaces/IDimDevice";

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
			let output: any = {};

			for (let i in this.model.Items) {
				let curRoom = this.model.Items[i];

				output[i] = {}
				output[i].id = curRoom._id;
				output[i].Name = curRoom.Name;
				output[i].Devices = RestApi.generateDeviceStructure(curRoom.Devices.Items);
			}

			res.end(JSON.stringify(output));
		});

		this.app.get('/rooms', (req: any, res: any) => {
			let output: any = {};

			for (let i in this.model.Items) {
				let curRoom = this.model.Items[i];

				output[i] = {}
				output[i].id = curRoom._id;
				output[i].Name = curRoom.Name;
			}

			res.end(JSON.stringify(output));
		});

		this.app.get('/devices', (req: any, res: any) => {
			let output: any = {};

			output = RestApi.generateDeviceStructure(this.model.GetDevices().Items);

			res.end(JSON.stringify(output));
		});

		this.app.get('/controll/:dev/:status', (req: any, res: any) => {
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
					switch (dev.Type) {
						case DeviceType.Toggle:
							{
								let castedDev = dev as IToggleDevice;

								if (req.params.status == 'on') castedDev.TurnOn();
								else if (req.params.status == 'off') castedDev.TurnOff();
								else if (req.params.status == 'toggle') castedDev.Toggle();
								else throw `Can't recognize parameter "${req.params.status}"!`
								break;
							}

						case DeviceType.RGB:
							{
								let castedDev = dev as IRGBDevice;

								if (req.params.status == 'on') castedDev.TurnOn();
								else if (req.params.status == 'off') castedDev.TurnOff();
								else if (req.params.status == 'toggle') castedDev.Toggle();

								else if (req.params.status == 'lighten') castedDev.Lighten();
								else if (req.params.status == 'darken') castedDev.Darken();

								else if (req.params.status.length == 6) castedDev.SetColor(Color.Parse(req.params.status));

								else throw `Can't recognize parameter "${req.params.status}"!`
								break;
							}

						case DeviceType.Dimmer:
							{
								let castedDev = dev as IDimDevice;

								if (req.params.status == 'on') castedDev.TurnOn();
								else if (req.params.status == 'off') castedDev.TurnOff();
								else if (req.params.status == 'toggle') castedDev.Toggle();

								else if (req.params.status == 'lighten') castedDev.Lighten();
								else if (req.params.status == 'darken') castedDev.Darken();

								else if (parseInt(req.params.status) >= 0 && parseInt(req.params.status) <= 100)
									castedDev.SetBrightness(parseInt(req.params.status));

								else throw `Can't recognize parameter "${req.params.status}"!`
								break;
							}

						case DeviceType.Blinds:
							{
								let castedDev = dev as IBlinds;

								if (req.params.status == 'up') castedDev.TurnUp();
								else if (req.params.status == 'down') castedDev.TurnDown();
								else if (req.params.status == 'stop') castedDev.Stop();

								else if (parseInt(req.params.status) >= 0 && parseInt(req.params.status) <= 100)
									castedDev.SetPosition(parseInt(req.params.status));

								else throw `Can't recognize parameter "${req.params.status}"!`
								break;
							}
					}
				}
				catch {
					//Try to query a room instead

					let room = this.model.GetById(req.params.dev);
					switch (req.params.status) {
						case 'on':
							room.TurnOn();
							break;

						case 'off':
							room.TurnOff();
							break;

						case 'lighten':
							room.Lighten();
							break;

						case 'darken':
							room.Darken();
							break;

						case 'up':
							room.TurnUp();
							break;

						case 'down':
							room.TurnDown();
							break;

						default:
							if (req.params.status.length == 6) {
								room.SetColor(Color.Parse(req.params.status));
							}
							else if (parseInt(req.params.status) >= 0 && parseInt(req.params.status) <= 100) {
								room.SetBrightness(parseInt(req.params.status));
							}
							else {
								throw `Can't recognize parameter "${req.params.status}"!`;
							}
							break;
					}
				}

				res.status(200).end('OK');
			}

			catch (error) {
				res.status(400).end(error);
			}
		});

		this.server = this.app.listen(8081, () => {
			let host = this.server.address().address,
				port = this.server.address().port;

			console.log(`Example app listening at http://${host}:${port}`);
		})
	}

	static generateDeviceStructure(data: IDevice[]): any {
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
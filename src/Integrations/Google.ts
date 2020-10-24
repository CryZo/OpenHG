// //const { smarthome } = require('actions-on-google');
// import { smarthome, actionssdk } from "actions-on-google";
// const { google } = require('googleapis');

// import { Helpers } from "../Helpers";
// import { RoomCollection } from "../RoomCollection";
// import { Color } from "../Color";
// import { DeviceType } from "../Enums/DeviceType";
// import { IToggleDevice } from "../interfaces/IToggleDevice";
// import { IRGBDevice } from "../interfaces/IRGBDevice";

// import express from "express";
// import bodyParser from "body-parser";

// import fs from "fs";
// import https from "https";

// export class Google {
// 	Model: RoomCollection;

// 	constructor(model: RoomCollection) {
// 		this.Model = model;

// 		this.Run();
// 	}

// 	async Run() {
// 		const auth = new google.auth.GoogleAuth({
// 			scopes: ['https://www.googleapis.com/auth/homegraph']
// 		});
// 		const homegraph = google.homegraph({
// 			version: 'v1',
// 			auth: auth,
// 		});

// 		const app = smarthome({
// 			debug: true,
// 		});



// 		app.onSync((body: any) => {
// 			let ret: any = {
// 				requestId: body.requestId,
// 				payload: {
// 					agentUserId: '123',
// 					devices: []
// 				}
// 			};

// 			let devs = this.Model.GetDevices().Items;
// 			for (let i in devs) {
// 				let curDev = devs[i];
// 				let dev: any = {}
// 				dev.id = curDev._id;
// 				dev.name = {
// 					name: curDev.Name
// 				}
// 				dev.willReportState = false;

// 				/*
// 				switch (curDev.Type) {
// 					case DeviceType.Toggle:
// 						dev.type = 'action.devices.types.LIGHT'
// 						dev.traits = [
// 							'action.devices.traits.OnOff'
// 						];
// 						break;

// 					case DeviceType.RGB:
// 						dev.type = 'action.devices.types.LIGHT'
// 						dev.traits = [
// 							'action.devices.traits.OnOff',
// 							'action.devices.traits.ColorSetting'
// 						];
// 						dev.attributes = {
// 							colorModel: 'rgb'
// 						};
// 						break;
// 				}*/

// 				dev.type = curDev.aog_Type;
// 				dev.traits = curDev.aog_Traits;
// 				dev.attributes = curDev.aog_Attributes;

// 				ret.payload.devices.push(dev);
// 			}

// 			return ret;
// 		});

// 		app.onQuery((body, headers) => {
// 			let ret: any = {
// 				requestId: body.requestId,
// 				payload: {
// 					devices: {
// 					}
// 				}
// 			};

// 			let devs = this.Model.GetDevices().Items;
// 			for (let i in devs) {
// 				let curDev = devs[i];
// 				let dev: any = {
// 					online: true,
// 				}

// 				//TODO Von AoG traits abhängig machen
// 				switch (curDev.Type) {
// 					case DeviceType.Toggle:
// 						{
// 							let tmp = curDev as IToggleDevice;
// 							dev.on = tmp.Status;
// 						}
// 						break;

// 					case DeviceType.RGB:
// 						{
// 							let tmp = curDev as IRGBDevice;
// 							dev.on = tmp.Status;
// 							dev.color = {
// 								spectrumRgb: parseInt(`0x${tmp.GetColor().GetHexColor()}`, 16)
// 							}
// 						}
// 						break;
// 				}

// 				ret.payload.devices[curDev._id] = dev;
// 			}

// 			return ret;
// 		});

// 		app.onExecute((body, headers) => {
// 			let res: any = {
// 				requestId: body.requestId,
// 				payload: {
// 					commands: []
// 				}
// 			};


// 			for (let i in body.inputs) {
// 				let curInput = body.inputs[i];
// 				for (let c in curInput.payload.commands) {
// 					let curCommand = curInput.payload.commands[c];
// 					let ids: string[] = [];
// 					let rprt: any = {
// 						ids: [],
// 						status: "SUCCESS",
// 						states: {
// 						}
// 					};

// 					for (let d in curCommand.devices) {
// 						let curDevice = curCommand.devices[d];
// 						ids.push(curDevice.id)
// 					}

// 					for (let e in curCommand.execution) {
// 						let curExecution = curCommand.execution[e];

// 						switch (curExecution.command) {
// 							case 'action.devices.commands.OnOff':
// 								for (let devId in ids) {
// 									let curDev = this.Model.GetDevices().GetById(ids[devId]) as IToggleDevice;

// 									if (curExecution.params.on) {
// 										curDev.TurnOn();
// 									}
// 									else {
// 										curDev.TurnOff();
// 									}

// 									rprt.states.on = curDev.Status;
// 									rprt.states.online = true;
// 								}
// 								break;


// 							case 'action.devices.commands.ColorAbsolute':
// 								for (let devId in ids) {
// 									let curDev = this.Model.GetDevices().GetById(ids[devId]) as IRGBDevice;

// 									let col = new Color();
// 									col.SetIntegerColor(parseInt(curExecution.params.color.spectrumRGB))
// 									curDev.SetColor(col);
									
// 									rprt.states.on = curDev.Status;
// 									rprt.states.online = true;
// 								}
// 								break;
// 						}

// 					}

// 					rprt.ids = ids;
// 					res.payload.commands.push(rprt);
// 				}
// 			}


// 			return res;
// 		});

// 		/*
// 		app.onDisconnect((body, headers) => {
// 			console.log('User account unlinked from Google Assistant');
// 			// Return empty response
// 			return {};
// 		});
// 		*/

// 		const expressApp = express().use(bodyParser.json());
// 		expressApp.post('/fulfillment', app);

// 		https.createServer({
// 			key: fs.readFileSync('certs/private.pem'),
// 			cert: fs.readFileSync('certs/chain.pem')
// 		}, expressApp)
// 			.listen(3000, function () {
// 				console.log('AOG fulfillment is listening on port 3000!')
// 			})
// 	}
// }
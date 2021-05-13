#!/usr/bin/env node

import { Device, DeviceController, Events, MQTTControls, MQTTHandler, RestApi, Room, RoomCollection } from "./";
import fs from 'fs';
import path from "path";

//Load config
var config: any = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), { encoding: 'utf8' }));

//Init MQTT handler
var mqtt = new MQTTHandler(config.MqttUrl);

//Init device controllerl
var dc = new DeviceController(mqtt);

var rooms = new RoomCollection();

//Create rooms
for (let i in config.Rooms) {
	let curObj: any = config.Rooms[i];
	let newRoom: Room = new Room();
	newRoom._id = i;
	newRoom.Name = curObj.Name;
	newRoom.Floor = curObj.Floor;

	rooms.Add(newRoom);
}

//Create devices and add them to the room
for (let i in config.Devices) {
	try {
		let curObj: any = config.Devices[i];
		let newDev: Device = dc.GetClass(curObj.Class, curObj.Name, i);

		//Apply extra parameters
		if (curObj.extraParams) {
			for (let param in curObj.extraParams) {
				(<any>newDev)[param] = curObj.extraParams[param];
			}
		}

		//Init
		newDev.Run();

		//Add to room
		const room = rooms.GetById(curObj.Room);
		room.Devices.Add(newDev);
		newDev.Room = room;
	}
	catch(e) {
		console.error(e);
	}
}

//Init rest api
var rest: RestApi = new RestApi(rooms);

if (config.Integrations) {
}


global.rooms = rooms;
global.eventHandler = new Events();

new MQTTControls(mqtt);

/*
 * Automation logic - import it from your repo!
 * 
 * 1. Clone your Repo to /src/Automation
 * 2. Copy your dependencies to /node_modules
 */
try {
	const automation = require("./Automation");

	try {
		console.info('Automation logic found. Launching module.');
		(<any>automation).Logic.Run(rooms);
	}
	catch (err) {
		console.error(err);
	}
}
catch {
	console.info('No automation logic was found.');
}

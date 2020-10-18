#!/usr/bin/env node

import { Room } from "./Room";
import { MQTTHandler } from "./MQTTHandler";
import { DeviceController } from "./DeviceController";
import { RoomCollection } from "./RoomCollection";
import { RestApi } from "./RestApi";
import fs from 'fs';
import path from "path";
import { Google } from "./Integrations/Google";
import { Events } from "./Events";
import { MQTTControls } from "./MQTTControls";

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

	rooms.Add(newRoom);
}

//Create devices and add them to the room
for (let i in config.Devices) {
	let curObj: any = config.Devices[i];
	let newDev: any = dc.GetClass(curObj.Class, curObj.Name, i);

	//Apply extra parameters
	if (curObj.extraParams) {
		for (let param in curObj.extraParams) {
			newDev[param] = curObj.extraParams[param];
		}
	}

	//Apply AoG types/traits (if set)
	if (curObj.aog_type && curObj.aog_traits) {
		newDev.aog_type = curObj.aog_type;
		newDev.aog_traits = curObj.aog_traits;
		if (curObj.aog_attributes)
			newDev.aog_Attributes = curObj.aog_attributes;
	}

	//Init
	newDev.Run();

	//Add to room

	try {
		rooms.GetById(curObj.Room).Devices.Add(newDev);
	}
	catch(e) {
		console.error(e);
	}
}

//Init rest api
var rest: RestApi = new RestApi(rooms);

if (config.Integrations) {
	if ((<string[]>config.Integrations).includes('Google')){
		//Init Google
		var google = new Google(rooms);
	}
}


global.rooms = rooms;
global.eventHandler = new Events();

new MQTTControls(mqtt);
import { Device, DeviceController, MQTTHandler } from "./";
import { DeviceType } from "./Enums";

export default class MQTTControls {
    handler: MQTTHandler;

    constructor (mh: MQTTHandler) {
        this.handler = mh;

        global.eventHandler.registerCallback(this.publishEvent.bind(this));
        global.eventHandler.registerCallback(this.publishModel.bind(this), 'change');

        this.handler.Subscribe('open-hg/cmd/device/#', this.handleDeviceCmd.bind(this))
        this.handler.Subscribe('open-hg/cmd/room/#', this.handleRoomCmd.bind(this))
    }

    handleDeviceCmd(payload: string, topic: string) {
        let id = topic.substr(19).split('/')[0];
        try {
            let dev = global.rooms.GetDevices().GetById(id);
            DeviceController.HandleCommand(dev, payload);
        }
        catch (err) {
            console.error(err);
        };
    }

    handleRoomCmd(payload: string, topic: string) {
        let parts: string[] = topic.substr(17).split('/')
        let id: string = parts[0];
        let devType: string = parts[1];
        try {
            let room = global.rooms.GetById(id);
            room.handleCommand(DeviceType[devType as keyof typeof DeviceType], payload)
        }
        catch (err) {
            console.error(err);
        };
    }

    //TODO Move this to the new event system
    publishEvent(payload: Device, type: string) {
    //     this.handler.SendCommand(`open-hg/event/${type}/${payload._id}`, JSON.stringify(payload, (key, value) => {
    //         if (key.substr(0, 1) == '_') {
    //           return undefined;
    //         }
            
    //         return value;
    //       }));
    }

    //TODO Move this to the new event system
    publishModel(payload: any, type: string) {
        this.handler.SendRetainedCommand(`open-hg/full`, global.rooms.stringify());
    }
}
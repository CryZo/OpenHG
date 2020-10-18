import { DeviceController } from "./DeviceController";
import { IDevice } from "./interfaces/IDevice";
import { MQTTHandler } from "./MQTTHandler";

export class MQTTControls {
    handler: MQTTHandler;

    constructor (mh: MQTTHandler) {
        this.handler = mh;

        global.eventHandler.registerCallback(this.publishEvent.bind(this));
        global.eventHandler.registerCallback(this.publishModel.bind(this), 'change');

        this.handler.Subscribe('open-hg/cmd/#', this.handleCmd.bind(this))
    }

    handleCmd(payload: string, topic: string) {
        let id = topic.substr(12).split('/')[0];
        try {
            let dev = global.rooms.GetDevices().GetById(id);
            DeviceController.HandleCommand(dev, payload);
        }
        catch (err) {
            console.error(err);
        };
    }

    publishEvent(payload: IDevice, type: string) {
        this.handler.SendCommand(`open-hg/event/${type}/${payload._id}`, JSON.stringify(payload, (key, value) => {
            if (key.substr(0, 1) == '_') {
              return undefined;
            }
            
            return value;
          }));
    }

    publishModel(payload: any, type: string) {
        this.handler.SendRetainedCommand(`open-hg/full`, global.rooms.stringify());
    }

    //TODO Implement an control function
}
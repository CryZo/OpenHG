import { Device } from "./";

interface IEvents {
    change: Function[];
}

export default class Events {
    private callbacks: IEvents = {
        change: []
    }

    public registerCallback(cb: Function, event?: keyof IEvents): void {
        if (event == null) {
            Object.values(this.callbacks).forEach(val => val.push(cb));

            return;
        }

        if (this.callbacks[event] != null) {
            this.callbacks[event].push(cb);
        }
    }

    public fire(event: keyof IEvents, device: Device, optionalData: {[name: string]: any} = {}): void {
        if (this.callbacks[event] != null) {
            this.callbacks[event].forEach(cb => {
                cb(device, event, optionalData);
            });
        }
    }
}

//TODO Refactoring: https://hackwild.com/article/event-handling-techniques/
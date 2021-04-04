import { Events, RoomCollection } from "../";

declare global {
    namespace NodeJS  {
        interface Global {
            rooms: RoomCollection;
            eventHandler: Events;
        }
    }
}
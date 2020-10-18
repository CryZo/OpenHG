import { Events } from "../Events";
import { RoomCollection } from "../RoomCollection";

declare global {
    namespace NodeJS  {
        interface Global {
            rooms: RoomCollection;
            eventHandler: Events;
        }
    }
}
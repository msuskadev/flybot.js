import { TransportType } from "./enums/transport-type.enum";

export default interface AirlineModel {
    id: string; 
    lcc: number;
    name: string;
    type: TransportType;
}
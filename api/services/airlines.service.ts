import AirlineModel from "../models/airline.model";
import { TransportType } from "../models/enums/transport-type.enum";

export default class AirlineService {
    public getAirlines() : AirlineModel[] {
        // if catch error load from file
        return [{
            "id": "test",
            "lcc": 0,
            "name": "fsdfdsfsdfs sfd dsf",
            "type": TransportType.bus
        }]
    }   

    public getAirlineLogos() {

    }
}
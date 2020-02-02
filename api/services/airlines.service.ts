import AirlineModel from "../models/airline.model";
import SkypickerGateway from "../gateways/skypicker.gateway";
import GatewayResponse from "../models/gateway-response.model";
import Files from "../utils/files";
import path from "path";

export default class AirlineService {
    private skypickerGateway: SkypickerGateway = new SkypickerGateway();

    public async getAirlines() : Promise<AirlineModel[]> {
        const allAirlines = await this.skypickerGateway.getAirlines();
        let airlines : AirlineModel[] = []

        if (allAirlines && allAirlines.status === 200) {
            airlines = (allAirlines.data as AirlineModel[]).filter(a => a.type.toLowerCase() === "airline");              
        } else {
            airlines = JSON.parse(Files.readFile(path.join(__dirname, "../assets/airlines/airlines.json")));
        }

        return airlines;
    }   

    public getAirlineLogos() {

    }
}
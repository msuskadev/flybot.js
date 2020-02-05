import AirlineModel from "../models/airline.model";
import SkypickerGateway from "../gateways/skypicker.gateway";
import GatewayResponse from "../models/gateway-response.model";
import Files from "../utils/files";
import path from "path";

export default class AirlineService {
    private skypickerGateway: SkypickerGateway = new SkypickerGateway();

    public async getAirlines() : Promise<AirlineModel[]> {
        const allAirlines : GatewayResponse | null = await this.skypickerGateway.getAirlines();
        let airlines : AirlineModel[] = [];

        if (allAirlines && allAirlines.status === 200) {
            airlines = (allAirlines.data as AirlineModel[]).filter(a => a.type.toLowerCase() === "airline");              
        } else {
            airlines = JSON.parse(Files.readFile(path.join(__dirname, "../assets/airlines/airlines.json")));
        }

        return airlines;
    }   

    public async getAirlineLogos() {
        const airlines : AirlineModel[] = await this.getAirlines();  

        for (let i = 0; i < airlines.length; i++) {
            this.delay(100);
            const id = `${airlines[i].id.trim()}.png`;
            await Files.downloadImage(`https://images.kiwi.com/airlines/64/${id}`, path.join(__dirname, `../assets/airlines/logos/${id}`));              
        }
    }

    private delay(ms: number)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
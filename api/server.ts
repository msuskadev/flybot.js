import express from "express";
import bodyparser from "body-parser";
import AirlinesRoutes from "./routes/airlines.route";
import AirportsRoutes from "./routes/airports.route";
import CountriesRoutes from "./routes/countries.route";
import FlightsRoutes from "./routes/flights.route";

export default class Server {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.app.use(bodyparser.json());    
        this.app.use(bodyparser.urlencoded({ extended: true }));
        this.app.use(new AirlinesRoutes().router);
        this.app.use(new AirportsRoutes().router);
        this.app.use(new CountriesRoutes().router);
        this.app.use(new FlightsRoutes().router);
    }

    public listen() : void {
        this.app.listen(this.port, () => {
            console.log(`FlyBot server is listening on port ${this.port}`);
        });
    }
}

new Server(3500).listen();



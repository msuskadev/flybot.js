import {Request, Response} from "express";
import AirportsService from "../services/airports.service";

export default class AirportsController {
    public async checkAirport(req: Request, res: Response) {
        const airportCode = req.params.airport.trim();
        const airport = new AirportsService().checkAirport(airportCode);
        
        if (airport) {
            return res.send(airport);
        }

        return res.status(400).send(`Airport ${airportCode} doesn't exist`);
    }

    public async getAllAirports(req: Request, res: Response) {    
        const airports = new AirportsService().getAllAirports();
        
        if (airports) {
            return res.send(airports);
        }

        return res.status(400).send(`Cannot get all airports`);
    }
}
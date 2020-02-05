import { Request, Response } from "express";
import FlightModel from "../models/flight.model";
import FlightsService from "../services/flights.service";

export default class FlightsController {
    public async basicFlightsSearch(req: Request, res: Response) {
        let flightModel: FlightModel = {
            flyFrom: req.body.flyFrom,
            flyTo: req.body.flyTo,
            dateFrom: req.body.dateFrom,
            dateTo: req.body.dateTo
        };
        
        const val = await new FlightsService().basicFlightsSearch(flightModel);
        res.json(flightModel);
    }

    public async advancedFlightsSearch(req: Request, res: Response) {        
        res.send('All logos successfully downloaded');
    }
}
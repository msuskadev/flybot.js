import { Request, Response } from "express";
import FlightModel from "../models/flight.model";
import FlightsService from "../services/flights.service";

export default class FlightsController {
    public async flightsSearch(req: Request, res: Response) {        
        const flightModel: FlightModel = {
            flyFrom: req.body.flyFrom,
            flyTo: req.body.flyTo,
            dateFrom: req.body.dateFrom,
            dateTo: req.body.dateTo,
            adults: req.body.adults ?? 1,
            children: req.body.children ?? 0,
            infants: req.body.infants ?? 0,
            flightType: req.body.flightType ?? "oneway",
            sort: req.body.sort ?? "price",
            maxStepOvers: req.body.maxStepOvers ?? 10
        };                
        res.json(await new FlightsService().flightsSearch(flightModel));
    }
}
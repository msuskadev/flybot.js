import express, { Request, Response } from "express";
import FlightsController from "../controllers/flights.controller";

export default class FlightsRoutes {
    private readonly Path : string = '/flights'
    private flightsController: FlightsController = new FlightsController();
    public router: express.Router;

    constructor () {
        this.router = express.Router();
        this.router.post(`${this.Path}/search`, this.flightsController.flightsSearch);        
    }
}
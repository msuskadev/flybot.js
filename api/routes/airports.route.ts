import express, { Request, Response } from "express";
import AirportsController from "../controllers/airports.controller";

export default class AirportsRoutes {
    private readonly Path : string = '/airports'
    private airportsController: AirportsController = new AirportsController();
    public router: express.Router;

    constructor () {
        this.router = express.Router();        
        this.router.get(`${this.Path}/:airport`, this.airportsController.checkAirport);
    }
}
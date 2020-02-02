import express, { Request, Response } from "express";
import AirlineController from "../controllers/airlines.controller";

export default class AirlinesRoutes {
    private readonly Path : string = '/airlines'
    private airlinesController: AirlineController = new AirlineController();
    public router: express.Router;

    constructor () {
        this.router = express.Router();
        this.router.get(this.Path, this.airlinesController.getAirlines);
        this.router.get(`${this.Path}/logos`, this.airlinesController.getAirlineLogos);
    }
}
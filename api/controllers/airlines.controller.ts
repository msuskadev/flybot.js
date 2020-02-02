import {Request, Response} from "express";
import AirlinesService from "../services/airlines.service";

export default class AirlinesController {
    constructor() {

    }

    public getAirlines(req: Request, res: Response) {
        const as = new AirlinesService().getAirlines();
        res.send(as);
    }

    public getAirlineLogos(req: Request, res: Response) {
        res.send("logos From controller");
    }
}
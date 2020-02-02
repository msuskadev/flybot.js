import {Request, Response} from "express";
import AirlinesService from "../services/airlines.service";

export default class AirlinesController {
    constructor() {

    }

    public async getAirlines(req: Request, res: Response) {
        res.send(await new AirlinesService().getAirlines());
    }

    public getAirlineLogos(req: Request, res: Response) {
        res.send("logos From controller");
    }
}
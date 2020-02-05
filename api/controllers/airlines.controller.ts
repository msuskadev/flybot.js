import {Request, Response} from "express";
import AirlinesService from "../services/airlines.service";

export default class AirlinesController {
    public async getAirlines(req: Request, res: Response) {
        res.send(await new AirlinesService().getAirlines());
    }

    public async getAirlineLogos(req: Request, res: Response) {
        // The method below was used only to get all airline logos - now it should remain commented         
        // await new AirlinesService().getAirlineLogos();
        res.send('All logos successfully downloaded');
    }
}
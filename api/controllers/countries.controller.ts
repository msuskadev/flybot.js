import {Request, Response} from "express";
import CountryService from "../services/countries.service";

export default class CountriesController {
    public async checkCountry(req: Request, res: Response) {
        const countryCode = req.params.countryCode.trim();
        const country = new CountryService().checkCountry(countryCode);
        
        if (country) {
            return res.send(country);
        }

        return res.status(400).send(`Country ${countryCode} doesn't exist`);
    }
}
import express, { Request, Response } from "express";
import CountryController from "../controllers/countries.controller";

export default class CountriesRoutes {
    private readonly Path : string = '/countries'
    private countryController: CountryController = new CountryController();
    public router: express.Router;

    constructor () {
        this.router = express.Router();        
        this.router.get(`${this.Path}`, this.countryController.getAllCountries);
        this.router.get(`${this.Path}/:countryCode`, this.countryController.checkCountry);
    }
}
import Airports from "../assets/airports.json";
import AirportModel from "../models/airport.model";

export default class AirportsService {
    public checkAirport(airport: string) : AirportModel {
        return Airports.find(a => a.iata.toLowerCase() === airport.toLowerCase()) as AirportModel;        
    }

    public getAllAirports() : AirportModel[] {
        return Airports as AirportModel[];        
    }
}
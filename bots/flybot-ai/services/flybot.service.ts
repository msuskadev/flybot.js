import axios, { AxiosError, AxiosResponse } from "axios";
import FlightModel from "../models/flight.model";
import TripModel from "../models/trip.model";
import CountryModel from "../models/country.model";
import AirportModel from "../models/airport.model";

export default class FlyBotService {
    public async validatePlace(place: string) : Promise<boolean> {
        let response: AxiosResponse;
        try {            
            response = await axios.get(`${process.env.FlybotApiUrl}/${place.length === 2 ? "countries" : "airports"}/${place}`);
            return response.status === 200;
        } catch {
            return false;
        }
    }

    public async getCityAirport(city: string) : Promise<AirportModel[]> {
        let response: AxiosResponse;
        try {
            response = await axios({
                method: 'get',
                url: `${process.env.FlybotApiUrl}/airports`,                
            });

            return response.data.filter((a: { iata: string; country: string; name: string; city: string; })  => a.city.toLowerCase() === city.toLowerCase()).map((item: { iata: string; country: string; name: string; city: string; }) => { return { title: item.name, value: item.iata }}) as AirportModel[];
        } catch (err) {
            console.error(err);            
        };

        return Promise.reject();
    }

    public async getCountryCode(country: string) : Promise<CountryModel> {
        let response: AxiosResponse;
        try {
            response = await axios({
                method: 'get',
                url: `${process.env.FlybotApiUrl}/countries`,                
            });

            return response.data.find((a: CountryModel)  => a.name.toLowerCase() === country.toLowerCase()) as CountryModel;
        } catch (err) {
            console.error(err);            
        };

        return Promise.reject();
    }

    public async getAirports(country: string) : Promise<AirportModel[]> {
        let response: AxiosResponse;
        try {
            response = await axios({
                method: 'get',
                url: `${process.env.FlybotApiUrl}/airports`,                
            });

            return response.data.filter((a: CountryModel)  => a.name === country).map((item: { iata: string; country: string; name: string; city: string; }) => { return { title: item.name, value: item.iata }}) as AirportModel[];
        } catch (err) {
            console.error(err);            
        };

        return Promise.reject();
    }

    public async searchFlights(flight: FlightModel) : Promise<TripModel[]> {
        let response: AxiosResponse;
        try {
            response = await axios({
                method: 'post',
                url: `${process.env.FlybotApiUrl}/flights/search`,
                data: flight
            });

            return response.data as TripModel[];
        } catch (err) {
            console.error(err);            
        };

        return Promise.reject();
    }
}
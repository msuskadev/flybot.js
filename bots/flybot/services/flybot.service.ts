import axios, { AxiosError, AxiosResponse } from "axios";
import FlightModel from "../models/flight.model";
import TripModel from "../models/trip.model";

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
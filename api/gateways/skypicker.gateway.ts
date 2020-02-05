import axios, { AxiosError, AxiosResponse } from "axios";
import GatewayResponse from "../models/gateway-response.model";
import FlightModel from "../models/flight.model";

export default class SkypickerGateway {
    public async getAirlines() : Promise<GatewayResponse | null> {
        try {
            const response: AxiosResponse = await axios.get("https://api.skypicker.com/airlines")
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText
            } as GatewayResponse;            
        } catch (error) {
            console.error(error);     
        }

        return null;
    }
    
    public async basicFlightsSearch(flightModel: FlightModel) : Promise<GatewayResponse | null> {
        try {
            const response: AxiosResponse = await axios.get(`https://api.skypicker.com/flights?fly_from=${flightModel.flyFrom}&fly_to=${flightModel.flyTo}&date_from=${flightModel.dateFrom}&date_to=${flightModel.dateTo}&curr=pln&partner=picky&v=3`)
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText
            } as GatewayResponse;            
        } catch (error) {
            console.error(error);     
        }

        return null;
    }
}
import axios, { AxiosError, AxiosResponse } from "axios";
import GatewayResponse from "../models/gateway-response.model";

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
}
import { FlightType } from "../types/flight.type";
import { SortType } from "../types/sort.type";

export default interface FlightModel {
    flyFrom: string; 
    flyTo: string;
    dateFrom: string;
    dateTo: string;
    adults?: number,
    children?: number,
    infants?: number
    flightType?: FlightType,
    sort?: SortType,
    maxStepOvers?: number 
}
export default interface FlightModel {
    flyFrom: string; 
    flyTo: string;
    dateFrom: string;
    dateTo: string;
    adults?: number,
    children?: number,
    infants?: number 
}
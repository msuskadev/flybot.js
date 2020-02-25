import FlightModel from "../models/flight.model";

export default class DataExtractor {
    private static readonly AirportsRegex: RegExp = /[a-z]{2,3}\s+[to]+\s+[a-z]{2,3}|[a-z]{2,3}\s*-\s*[a-z]{2,3}/g;
    private static readonly DateRegex: RegExp = /\d{2}\/\d{2}\/\d{4}\s*/g;  //[and,-]+\s*\d{2}\/\d{2}\/\d{4}
    
    public static extract(text: string) : FlightModel | null {
        try {
            text = text.toLowerCase();
            const flight: FlightModel = {
                flyFrom: '',
                flyTo: '',
                dateFrom: '',
                dateTo: ''
            };        

            if (this.AirportsRegex.test(text) && this.DateRegex.test(text)) {
                const route = text.match(this.AirportsRegex);
                if (route) {
                    const splitRoute = route[0].trim().replace(' to ', '-').split('-');
                    flight.flyFrom = splitRoute[0].trim().toUpperCase();
                    flight.flyTo = splitRoute[1].trim().toUpperCase();
                }

                const dates = text.match(this.DateRegex);
                if (dates) {
                    flight.dateFrom = flight.dateTo = dates[0].trim();
                }

                return flight;
            }
            return null;
        } catch {
            return null;
        }
    } 
}
import TripModel from "../models/trip.model";
import RouteModel from "../models/route.model";

export default class MessageFormatter {
    public static format(flights: TripModel[]) : string {
        let result: string = '\r\n';
        let index: number = 1;       
        flights.forEach(flight => {
            result += `## ${index}. **${flight.flyFrom}** - **${flight.flyTo}** ### \r\n` +
            `**Departure from:**  ${flight.flyFrom}, ${flight.cityFrom}, ${flight.countryFromName}\r\n` +
            `**Arrival at:**      ${flight.flyTo}, ${flight.cityTo}, ${flight.countryToName}\r\n` +
            `**Flight duration:** ${flight.flightDuration}\r\n` +
            `**Flight distance:** ${flight.distance} km\r\n` +
            `**Route:**\r\n` +
            `${this.formatRoute(flight.route)}\r\n` +
            `____________________________________________________\r\n` +
            `**Total price:**     ${flight.pricePln} PLN / ${flight.priceEur} EUR\r\n` +
            `[Booking Link](${flight.bookingLink})\r\n\r\n`; 

            index++;
        });
        
        return result;
    }

    private static formatRoute(route: RouteModel[]) : string {
        let result: string = '';

        route.forEach(r => {
            result += `* **From:** ${r.flyFrom}, ${r.cityFrom} on ${new Date(r.departureTimeUTC * 1000).toLocaleDateString()} at ${new Date(r.departureTimeUTC * 1000).toLocaleTimeString()}\r\n` + 
            `**To:** ${r.flyTo}, ${r.cityTo} on ${new Date(r.arrivalTimeUTC * 1000).toLocaleDateString()} at ${new Date(r.arrivalTimeUTC * 1000).toLocaleTimeString()}\r\n` +
            `**Flight No.:** ${r.airlineName}, ${r.airlineCode}${r.flight_no}\r\n` +
            `**Operator:**\r\n` + 
            `![](${r.airlineLogoSmall})\r\n`;
        });

        return result;
    }
}
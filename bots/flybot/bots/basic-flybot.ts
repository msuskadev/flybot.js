import { ActivityHandler, MessageFactory, EndOfConversationCodes, Activity } from 'botbuilder';
import DataExtractor from '../utils/data-extractor';
import FlyBotService from '../services/flybot.service';
import FlightModel from '../models/flight.model';
import MessageFormatter from '../utils/message-formatter';
import TripHelper from '../utils/trip-helper';

export class BasicFlyBot extends ActivityHandler {
    private flybotService: FlyBotService; 
    
    constructor() {
        super();    
        this.flybotService = new FlyBotService();

        this.onMessage(async (context, next) => {
            const flight = DataExtractor.extract(context.activity.text);
            if (flight) {            
                // for debugging purpose only
                console.log(JSON.stringify(flight));

                if (!(await this.flybotService.validatePlace(flight.flyFrom))) {
                    await context.sendActivity(MessageFactory.text(this.preparePlacenotFoundAnswer(flight.flyFrom)));
                } else if (!(await this.flybotService.validatePlace(flight.flyTo))) {
                    await context.sendActivity(MessageFactory.text(this.preparePlacenotFoundAnswer(flight.flyTo)));
                } else {
                    
                    await context.sendActivities([
                        { type: 'typing' }]);
                    await context.sendActivities([
                        ...await this.searchFlights(flight)
                    ]);
                    await context.sendActivities([
                        MessageFactory.text('Enjoy your trip! Safe flight!')
                    ]);
                }            
            } else {
                await context.sendActivity(MessageFactory.text('Cannot find flights. Invalid parameters'));
            }
            await next();
        });        
    }

    private preparePlacenotFoundAnswer(place: string) : string {        
        return `${place.length === 2? 'Country' : 'Airport'} ${place} doesn't exist.`;
    }

    private async searchFlights(flight: FlightModel): Promise<Partial<Activity>[]> {
        const allFlights = await this.flybotService.searchFlights(flight);

        return [MessageFactory.text("# **FASTEST FLIGHTS:** " + MessageFormatter.format(TripHelper.getFastestFlights(allFlights))),
                MessageFactory.text("# **CHEAPEST FLIGHTS:** " + MessageFormatter.format(TripHelper.getCheapestFlights(allFlights)))];
    }
}
import { AttachmentLayoutTypes, CardFactory, MessageFactory, StatePropertyAccessor, TurnContext, ConversationState } from 'botbuilder';
import {
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    DateTimePrompt,
    DateTimeResolution,
    NumberPrompt,
    DialogSet,
    DialogState,
    DialogTurnResult,
    DialogTurnStatus,
    PromptValidatorContext,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext,
    ConfirmPrompt
} from 'botbuilder-dialogs';
import FlyBotService from "../services/flybot.service";
import FlightModel from '../models/flight.model';
import DialogPropertiesModel from '../models/dialog-properties.model';
import moment from 'moment';
import CardFormatter from '../utils/card-formatter';
import TripHelper from '../utils/trip-helper';

const SEARCH_FLIGHTS_DIALOG = 'SEARCH_FLIGHTS_DIALOG';
const WATERFALL_SEARCH_FLIGHTS_DIALOG = 'WATERFALL_SEARCH_FLIGHTS_DIALOG';
const FLY_FROM_TEXT = 'FLY_FROM_TEXT';
const FLY_TO_TEXT = 'FLY_TO_TEXT';
const TRAVEL_DATE_CHOICE = 'TRAVEL_DATE_CHOICE';
const TRAVEL_DATE = 'TRAVEL_DATE';
const TRAVEL_ALONE_OR_WITH_FF_CHOICE = 'TRAVEL_ALONE_OR_WITH_FF_CHOICE';
const NUMBER_OF_ADULTS = 'NUMBER_OF_ADULTS';
const NUMBER_OF_CHILDREN = 'NUMBER_OF_CHILDREN';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';

export class SearchFlightsDialog extends ComponentDialog {
    private dialogProperties!: DialogPropertiesModel;

    constructor() {
        super(SEARCH_FLIGHTS_DIALOG);

        this.addDialog(new TextPrompt(FLY_FROM_TEXT, this.airportCountryCodeValidator.bind(this)))
            .addDialog(new TextPrompt(FLY_TO_TEXT, this.airportCountryCodeValidator.bind(this)))        
            .addDialog(new ChoicePrompt(TRAVEL_DATE_CHOICE))
            .addDialog(new DateTimePrompt(TRAVEL_DATE, this.dateTimePromptValidator.bind(this)))
            .addDialog(new ChoicePrompt(TRAVEL_ALONE_OR_WITH_FF_CHOICE))
            .addDialog(new NumberPrompt(NUMBER_OF_ADULTS))
            .addDialog(new NumberPrompt(NUMBER_OF_CHILDREN))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_SEARCH_FLIGHTS_DIALOG, [
                this.getDepartureAirport.bind(this),
                this.getArrivalAirport.bind(this),
                this.choiceTravelDate.bind(this),
                this.getTravelDate.bind(this),
                this.isTravellingAlone.bind(this),
                this.getAdultsNumber.bind(this),
                this.getChildrenNumber.bind(this),
                this.summaryStep.bind(this),
                this.finalStep.bind(this),
            ]));
        
        this.initialDialogId = WATERFALL_SEARCH_FLIGHTS_DIALOG;
    }

    public async run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>, dialogProperties: StatePropertyAccessor<DialogPropertiesModel>) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        this.dialogProperties = await dialogProperties.get(context, { active: false });
        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            this.dialogProperties.active = true; 
            await dialogContext.beginDialog(this.id);
        }
    }

    private async getDepartureAirport(step: WaterfallStepContext) : Promise<DialogTurnResult> {
        return await step.prompt(FLY_FROM_TEXT, 'Please enter departure airport (like WRO, JFK) or country code (PL, DE)');
    }

    private async getArrivalAirport(step: WaterfallStepContext) : Promise<DialogTurnResult> {
        const flight = step.options as FlightModel;
        flight.flyFrom = step.result.toUpperCase();

        return await step.prompt(FLY_TO_TEXT, 'Where would you like to arrive at? (IATA Airport Code or Country Code)');
    }

    private async choiceTravelDate(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        const flight = step.options as FlightModel;
        flight.flyTo = step.result.toUpperCase();

        return await step.prompt(TRAVEL_DATE_CHOICE, {
            choices: ChoiceFactory.toChoices(['Today', 'Tomorrow', 'Other Date']),
            prompt: 'When do you want to travel?'
        });
    }

    private async getTravelDate(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        let date = moment();
        if (step.result.value === 'Today') {
            return step.next([{value: date }]);
        }

        if (step.result.value === 'Tomorrow') {
            return step.next([{ value: date.add(1, 'days') }]);
        }

        return await step.prompt(TRAVEL_DATE, 'On what date would you like to travel?');
    }

    private async isTravellingAlone(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        const flight = step.options as FlightModel;
        flight.dateFrom = flight.dateTo = moment(step.result[0].value).format('DD/MM/YYYY');

        return await step.prompt(TRAVEL_ALONE_OR_WITH_FF_CHOICE, {
            choices: ChoiceFactory.toChoices(['Alone', 'With Family']),
            prompt: 'Do you travel alone or with family?'
        });
    }

    private async getAdultsNumber(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        if (step.result.value === 'Alone') {
            return step.next(1);
        }

        return await step.prompt(NUMBER_OF_ADULTS, 'How many adults will fly with you? (including you)');
    }

    private async getChildrenNumber(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        const flight = step.options as FlightModel;
        flight.adults = step.result;
        
        if (flight.adults === 1) {
            return step.next(0);
        }

        return await step.prompt(NUMBER_OF_CHILDREN, 'How many children will fly with you?');
    }

    private async summaryStep(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        const flight = step.options as FlightModel;
        flight.children = step.result;        

        return await step.prompt(CONFIRM_PROMPT, this.prepareConfirmationText(flight));
    }

    private async finalStep(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        try {
            if (step.result) {
                await step.context.sendActivities([
                    { type: 'typing' }]);

                const allFlights = await new FlyBotService().searchFlights(step.options as FlightModel);   
                if (allFlights && allFlights.length > 0) {            
                    await step.context.sendActivity({
                        attachments: [
                        CardFactory.heroCard(
                        'Fastest Flights',
                        CardFactory.images(['https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQA-U0NX5KEftXustpxV0Po39vlCC5ytRmdqQ&usqp=CAU'])
                    )]});
    
                    await step.context.sendActivity({
                        attachmentLayout: AttachmentLayoutTypes.Carousel,
                        attachments: [                        
                            ...CardFormatter.format(TripHelper.getFastestFlights(allFlights))
                        ]
                    });
    
                    await step.context.sendActivity({
                        attachments: [
                        CardFactory.heroCard(
                        'Cheapest Flights',
                        CardFactory.images(['data:image/jpeg;base64,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'])
                    )]});
    
                    await step.context.sendActivity({
                        attachmentLayout: AttachmentLayoutTypes.Carousel,
                        attachments: [
                            ...CardFormatter.format(TripHelper.getCheapestFlights(allFlights))
                        ]
                    });
    
                    await step.context.sendActivities([
                        MessageFactory.text('Enjoy your trip! Safe flight!')
                    ]);
                } else {
                    await step.context.sendActivities([
                        MessageFactory.text(`There's no available flights!`)
                    ]);
                }
            }

            this.dialogProperties.active = false;            
        } catch (err) {
            console.error(err);
        }

        return await step.endDialog();
    }

    private async airportCountryCodeValidator(promptContext: PromptValidatorContext<string>) : Promise<boolean> {
        let result: boolean = false;
        if (promptContext.recognized.value?.length === 2 || promptContext.recognized.value?.length === 3) {
            result = await new FlyBotService().validatePlace(promptContext.recognized.value.toUpperCase());            
        }
        if (!result) {
            promptContext.options.prompt = "Incorrect value! Please enter IATA airport code ex. WRO, JFK or country code ex. PL, DE or US";
            return false;    
        }

        return true;
    }

    private async dateTimePromptValidator(promptContext: PromptValidatorContext<DateTimeResolution[]>): Promise<boolean> {
        let result: boolean = false;
        if (promptContext.recognized.succeeded && promptContext.recognized.value) {                        
            result = moment(promptContext.recognized.value[0].value).isValid();
        }
        
        if (!result) {
            promptContext.options.prompt = "Incorrect date format! Please reenter travel date? (YYYY-MM-DD)";
            return false;    
        }

        return true;        
    }

    private prepareConfirmationText(flight: FlightModel) : string {
        let message = `Please confirm you want to travel from ${flight.flyFrom.toUpperCase()} to ${flight.flyTo.toUpperCase()} on ${flight.dateTo}.`;
        
        if (flight.adults && flight.adults > 1) {
            message += ` You need ${flight.adults + (flight.children ? flight.children : 0) } tickets for ${flight.adults} adults and ${flight.children} children`;  
        }
        
        return message;
    }
}
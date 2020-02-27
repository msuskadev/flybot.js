import { ActivityHandler, BotState, ConversationState, StatePropertyAccessor, UserState } from 'botbuilder';
import { Dialog, DialogState } from 'botbuilder-dialogs';
import { SearchFlightsDialog } from '../dialogs/search-flights-dialog';

export class DialogFlyBot extends ActivityHandler {    
    private conversationState: BotState;
    private userState: BotState;
    private dialog: Dialog;
    private dialogState: StatePropertyAccessor<DialogState>;

    constructor(conversationState: BotState, userState: BotState) {
        super();

        this.conversationState = conversationState as ConversationState;
        this.userState = userState as UserState;
        this.dialog = new SearchFlightsDialog();
        this.dialogState = this.conversationState.createProperty<DialogState>('DialogState');

        this.onMessage(async (context, next) => {     
            await (this.dialog as SearchFlightsDialog).run(context, this.dialogState);    
            await next();
        });

        this.onDialog(async (context, next) => {
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);
            await next();
        });
    }
}
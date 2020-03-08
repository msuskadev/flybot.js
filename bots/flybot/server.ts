import * as resify from 'restify';
import { ActivityTypes, BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } from 'botbuilder';
import { config } from 'dotenv';
import { resolve } from 'path';
import { BasicFlyBot } from './bots/basic-flybot';
import { WelcomeFlyBot } from './bots/welcome-flybot';
import { DialogFlyBot } from './bots/dialog-flybot';
import DialogPropertiesModel from './models/dialog-properties.model';

config({ path: resolve(__dirname, '..', '.env') });
const flyBotPort = process.env.FlyBotPort || 3900; 
const server = resify.createServer();

const dialogBotQuestions = [
    'search flight',
    'search flights',
    'find flight',
    'find flights',
];

// Define a state store for your bot. See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state store to persist the dialog and user state between messages.
let conversationState: ConversationState;
let userState: UserState;

// For local development, in-memory storage is used.
// CAUTION: The Memory Storage used here is for local bot debugging only. When the bot
// is restarted, anything stored in memory will be gone.
// For store data on production environment is recommended to use Azure Blob Storage or Cosmos DB
const memoryStorage = new MemoryStorage();
conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const basicFlyBot = new BasicFlyBot();
const dialogFlyBot = new DialogFlyBot(conversationState, userState);
const welcomeFlyBot = new WelcomeFlyBot();

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        if (context.activity.type === ActivityTypes.Message) {
            const dialogState = (await conversationState.load(context)).DialogProperties as DialogPropertiesModel;
            // simple decision tree - for the demo purpose, don't judge me :-) 
            if ((dialogState && dialogState.active) || dialogBotQuestions.includes(context.activity.text.toLowerCase())) {
                return await dialogFlyBot.run(context);
            } else {
                return await basicFlyBot.run(context);
            }            
        } else if (context.activity.type === ActivityTypes.ConversationUpdate) {
            return await welcomeFlyBot.run(context);
        }
    });
});

server.listen(flyBotPort, () => {
    console.log(`Server is listening on port ${flyBotPort}`);
});
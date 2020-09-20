import * as resify from 'restify';
import { LuisApplication } from 'botbuilder-ai';
import { ActivityTypes, BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } from 'botbuilder';
import { config } from 'dotenv';
import { resolve } from 'path';
import { AiBot } from './bots/ai-bot';
import { WelcomeFlyBot } from './bots/welcome-flybot';
import DialogPropertiesModel from './models/dialog-properties.model';

config({ path: resolve(__dirname, '..', '.env') });
const flyBotPort = process.env.FlyBotPort || 3900; 
const server = resify.createServer();
const luisApplication: LuisApplication = {
    applicationId: process.env.LuisAppId || '',
    endpoint: process.env.LuisAPIHostName,
    endpointKey: process.env.LuisAPIKey || ''
};

// Define a state store for your bot. See https://aka.npmms/about-bot-state to learn more about using MemoryStorage.
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

const aiBot = new AiBot(luisApplication);
const welcomeFlyBot = new WelcomeFlyBot();

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        if (context.activity.type === ActivityTypes.Message) {            
            return await aiBot.run(context);            
        } else if (context.activity.type === ActivityTypes.ConversationUpdate) {
            return await welcomeFlyBot.run(context);
        }
    });
});

server.listen(flyBotPort, () => {
    console.log(`Server is listening on port ${flyBotPort}`);
});
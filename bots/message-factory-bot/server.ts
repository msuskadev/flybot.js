import * as resify from 'restify';
import { BotFrameworkAdapter } from 'botbuilder';
import { config } from 'dotenv';
import { resolve } from 'path';
import { MessageFactoryBot } from './bot/message-factory-bot';

config({ path: resolve(__dirname, '..', '.env') })
const messageFactoryBotPort = process.env.MessageFactoryBotPort || 3900; 
const server = resify.createServer();

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const messageFactoryBot = new MessageFactoryBot();
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => { 
        await messageFactoryBot.run(context);
    });
});

server.listen(process.env.MessageFactoryBotPort, () => {
    console.log(`Server is listening on port ${messageFactoryBotPort}`);
});
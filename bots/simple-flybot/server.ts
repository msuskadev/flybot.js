import * as resify from 'restify';
import { BotFrameworkAdapter } from 'botbuilder';
import { config } from 'dotenv';
import { resolve } from 'path';
import { FlyBot } from './bot/flybot';

config({ path: resolve(__dirname, '..', '.env') })
const echoBotPort = process.env.EchoBotPort || 3900; 
const server = resify.createServer();

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const flyBot = new FlyBot();
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => { 
        await flyBot.run(context);
    });
});

server.listen(process.env.EchoBotPort, () => {
    console.log(`Server is listening on port ${echoBotPort}`);
});
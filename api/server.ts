import express from "express";
import AirlinesRoutes from "./routes/airlines.route";

export default class Server {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.app.use(new AirlinesRoutes().router);
    }

    public listen() : void {
        this.app.listen(this.port, () => {
            console.log(`FlyBot server is listening on port ${this.port}`);
        });
    }
}

new Server(3000).listen();


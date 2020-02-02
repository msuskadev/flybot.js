import express from "express";
const app = express();

const server = app.listen(1111, () => {
    console.log('Server has been started');
});

export default server;


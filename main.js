import http from "http";
import express from "express";
import apiFactory from "./api/api-factory.js";
import fetch from "node-fetch";

const host = process.env.HOST ?? "0.0.0.0";
const port = process.env.PORT ?? 3000;

const app = express();

app.set("port", port);
app.use(express.static("./public"));
// инициализация API
app.use("/api/v1/", apiFactory("v1"));
http.createServer(app).listen(port, host, () => {
    console.log("App server running at", host + ":" + port);
    fetch("http://"+host+":"+port+"/api/v1/init");
});
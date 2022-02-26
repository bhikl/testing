import express from "express";
import { Db } from "../Db/Db.js";

let db = new Db;
db.init_Db();
db.fetch_data();
export default function () {
    const router = express.Router();

    router.get("/", (_, res) => {
        console.log("success");
        res.json({ res: "Success" });
    });
    router.get("/refresh", (_, res) => {
        db.fetch_data();
        res.json({ res: "Success" });
    });
    router.get("/get", async (_, res) => {
        try {
            let respFromDb = await db.fetch_rows();
            res.json(respFromDb);
        } catch (err) {
            console.log(err);
        }
    });
    return router;
}
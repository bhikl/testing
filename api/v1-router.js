import express from "express";
import { Db } from "../Db/Db.js";

let db;

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
            console.log(respFromDb[0]);
            res.json(respFromDb);
        } catch (err) {
            console.log(err);
        }
    });
    router.get("/init", async () => {
        try {
            db = new Db;
            await db.init_Db();
            await db.fetch_data();
        } catch (err) {
            console.log(err);
        }
    });
    return router;
}
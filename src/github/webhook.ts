import { Request, Response } from "express";
import { processPR } from "./processPr";   

export async function handlePR(req: Request, res: Response) {
    const event = req.headers["x-github-event"] as string;
    console.log("Event received:", event);

    if (event === "pull_request") {
        const action = req.body.action;
        const pr = req.body.pull_request;
        
        if (action === "opened" || action === "synchronize") {
            console.log("PR received:", pr.title);
            await processPR(pr);
        }
    }
    res.sendStatus(200)
}
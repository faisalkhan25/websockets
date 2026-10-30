import { Router } from "express";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches-validation.js";
import { db } from "../db/db.js";
import { matches } from "../db/schema.js";
import { getMatchStatus } from "../utils/match-status.js";
import { desc } from "drizzle-orm";

export const matchRouter = Router();
const MAX_LIMIT = 100;

matchRouter.get("/", async (req, res) => { 
    const parsedQuery = listMatchesQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
        return res.status(400).json({ error: "Invalid Payload", details: parsedQuery.error.issues });
    }

    const limit = Math.min(parsedQuery.data.limit ?? 10, MAX_LIMIT);

    try {
        const events = await db
        .select().from(matches)
        .limit(limit)
        .orderBy(desc(matches.createdAt));
        res.status(200).json({ data: events });
    }catch(e) {
        res.status(500).json({
            error: "Failed to list matches",
        })
    }
});

matchRouter.post("/", async (req, res) => {
    const parsedBody = createMatchSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid Payload", details: parsedBody.error.issues });
    }
    const { data: { startTime, endTime, homeScore, awayScore } } = parsedBody;

    try {
        const [event] = await db.insert(matches).values({
            ...parsedBody.data,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime),
        }).returning();

        res.status(201).json({ data: event });
    } catch (e) {
        res.status(500).json({
            error: "Failed to create match",
        })
    }
})

export default matchRouter;
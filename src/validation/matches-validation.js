import { z } from "zod";

export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

const isValidIsoDateString = (value) => {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return false;
  }
  const date = new Date(parsed);
  return !Number.isNaN(date.getTime());
};

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMatchSchema = z
  .object({
    sport: z.string().min(1),
    homeTeam: z.string().min(1),
    awayTeam: z.string().min(1),
    startTime: z
      .string()
      .refine(isValidIsoDateString, { message: "Invalid ISO date string" }),
    endTime: z
      .string()
      .refine(isValidIsoDateString, { message: "Invalid ISO date string" }),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    if (end.getTime() <= start.getTime()) {
      ctx.addIssue({
        code: "custom",
        message: "endTime must be after startTime",
        path: ["endTime"],
      });
    }
  });

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});

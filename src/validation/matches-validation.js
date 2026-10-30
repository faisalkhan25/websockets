import { z } from "zod";

export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

// ISO 8601 datetime with a timezone (`Z` or `±HH:mm`), including real calendar dates.
const isoDateTimeSchema = z.iso.datetime({ offset: true });

const isValidIsoDateString = (value) =>
  isoDateTimeSchema.safeParse(value).success;

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
    homeScore: z.number().int().nonnegative().optional(),
    awayScore: z.number().int().nonnegative().optional(),
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
  homeScore: z.number().int().nonnegative(),
  awayScore: z.number().int().nonnegative(),
});

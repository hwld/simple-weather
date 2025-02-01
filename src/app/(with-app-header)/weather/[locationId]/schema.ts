import { z } from "zod";

export const WeatherSummaryParamsSchema = z
  .object({
    /** 地域検索の結果得られたID */
    locationId: z.string().min(1),
  })
  .strict();

export type WeatherSummaryParams = z.infer<typeof WeatherSummaryParamsSchema>;

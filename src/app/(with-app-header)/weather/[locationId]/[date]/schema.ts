import { isValid, parse } from "date-fns";
import { z } from "zod";

export const WeatherDetailParamsSchema = z
  .object({
    /** 地域検索の結果得られたID */
    locationId: z.string().min(1),

    /** yyyy-MM-dd形式の日付 */
    date: z
      .string()
      .min(1)
      .refine((val) => {
        const date = parse(val, "yyyy-MM-dd", new Date());
        return isValid(date);
      }),
  })
  .strict();

export type WeatherDetailParams = z.infer<typeof WeatherDetailParamsSchema>;

import { LocationSchema } from "@/backend/weather/schema";
import { z } from "zod";

export const LocationSearchSearchParamsSchema = z.object({
  query: z.string(),
});

export type LocationSearchSearchParams = z.infer<
  typeof LocationSearchSearchParamsSchema
>;

export const LocationSearchResponseSchema = z.object({
  locations: z.array(LocationSchema),
});

export type LocationSearchResponse = z.infer<
  typeof LocationSearchResponseSchema
>;

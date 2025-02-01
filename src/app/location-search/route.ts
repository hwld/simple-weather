import { WeatherApiKey } from "@/api/consts";
import { SearchResponseSchema } from "@/api/schema";
import { SearchApiUrl } from "@/api/url";
import { searchParamsToObject } from "@/utils/search-params-to-object";
import {
  LocationSearchApiSearchParamsSchema,
  LocationSearchResponse,
} from "@/routes";
import ky from "ky";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const requestUrl = new URL(req.url);

    const paramsResult = LocationSearchApiSearchParamsSchema.safeParse(
      searchParamsToObject(requestUrl.searchParams)
    );
    if (paramsResult.error) {
      return new Response("Bad Request", { status: 400 });
    }

    const json = await ky
      .get(SearchApiUrl, {
        searchParams: {
          key: WeatherApiKey,
          q: paramsResult.data.query,
        },
      })
      .json();

    const data = SearchResponseSchema.parse(json);
    return Response.json({ locations: data } satisfies LocationSearchResponse, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
}

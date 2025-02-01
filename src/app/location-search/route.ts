import { searchParamsToObject } from "@/utils/search-params-to-object";
import {
  LocationSearchApiSearchParamsSchema,
  LocationSearchResponse,
} from "@/routes";
import { fetchLocations } from "@/backend/weather/fetch";

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

    const { locations } = await fetchLocations(paramsResult.data.query);

    return Response.json({ locations } satisfies LocationSearchResponse, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
}

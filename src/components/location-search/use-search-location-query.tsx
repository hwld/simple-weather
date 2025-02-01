import { ApiRoutes } from "@/routes";
import { LocationSearchResponseSchema } from "@/app/location-search/schema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ky from "ky";

export function useSearchLocationQuery(searchQuery: string) {
  const {
    data: locations = [],
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["search-location", searchQuery],
    enabled: searchQuery.length > 0,
    queryFn: async () => {
      const response = await ky
        .get(ApiRoutes.locationSearch({ query: searchQuery }), { retry: 0 })
        .json();
      const data = LocationSearchResponseSchema.parse(response);
      return data.locations;
    },
    placeholderData: keepPreviousData,
  });

  return { locations, isFetching, isError };
}

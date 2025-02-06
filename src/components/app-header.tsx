import { HomePageNavigation } from "@/components/home-page-navigation";
import { LocationSearchDialogTrigger } from "@/components/location-search/dialog-trigger";
import { IconCloudFilled } from "@tabler/icons-react";

export function AppHeader() {
  return (
    <div className="grid gap-6 p-4 border-x border-b border-base-200 rounded-b-lg bg-base-50 shadow-sm min-w-0 grid-cols-1">
      <h1 className="flex justify-between flex-wrap gap-2">
        <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
          <IconCloudFilled className="text-primary-500 size-5" />
          <p className="text-base font-bold leading-none">SimpleWeather</p>
        </div>
        <HomePageNavigation />
      </h1>
      <LocationSearchDialogTrigger />
    </div>
  );
}

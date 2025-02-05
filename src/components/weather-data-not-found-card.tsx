import { IconMaximize } from "@tabler/icons-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

type Props = { date: string };

export async function WeatherDataNotFoundCard({ date }: Props) {
  return (
    <Card>
      <div className="min-h-[300px] grid place-content-center place-items-center gap-4">
        <IconMaximize size={50} className="text-base-500" />
        <div className="text-center">
          <p>
            <span className="font-bold">
              `{format(date, "yyyy年MM月dd日")}`
            </span>
            の天気予報が表示できませんでした
          </p>
          <p>表示できるのは直近の天気予報のみです</p>
        </div>
      </div>
    </Card>
  );
}

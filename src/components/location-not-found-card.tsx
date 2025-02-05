import { IconQuestionMark } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";

export async function LocationNotFoundCard() {
  return (
    <Card>
      <div className="min-h-[300px] grid place-content-center place-items-center gap-4">
        <IconQuestionMark size={50} className="text-base-500" />
        <div className="text-center">
          <p>地域が見つかりませんでした</p>
          <p>上の検索バーからもう一度検索してみてください</p>
        </div>
      </div>
    </Card>
  );
}

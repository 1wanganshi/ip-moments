import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ConfigNotice({ message }: { message: string }) {
  return (
    <Card className="mb-4 border-amber-200 bg-amber-50 text-amber-950 shadow-none">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">后端服务未连接</p>
          <p className="mt-1 text-xs leading-5">{message}</p>
        </div>
      </div>
    </Card>
  );
}

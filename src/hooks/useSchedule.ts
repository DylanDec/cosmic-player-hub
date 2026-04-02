import { useQuery } from "@tanstack/react-query";
import { stationScheduleUrl } from "@/config/radio";

export interface ScheduleItem {
  id: number;
  type: string;
  name: string;
  title: string;
  description: string;
  start_timestamp: number;
  start: string;
  end_timestamp: number;
  end: string;
  is_now: boolean;
}

export function useSchedule() {
  return useQuery<ScheduleItem[]>({
    queryKey: ["schedule"],
    queryFn: async () => {
      const res = await fetch(stationScheduleUrl());
      if (!res.ok) throw new Error("Failed to fetch schedule");
      return res.json();
    },
    refetchInterval: 60_000,
    retry: 3,
  });
}

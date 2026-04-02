import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="font-display text-3xl sm:text-4xl font-bold tracking-wider tabular-nums">
      <span className="text-foreground">{hours}</span>
      <span className="text-primary animate-pulse">:</span>
      <span className="text-foreground">{minutes}</span>
      <span className="text-primary animate-pulse">:</span>
      <span className="text-muted-foreground text-2xl sm:text-3xl">{seconds}</span>
    </div>
  );
}

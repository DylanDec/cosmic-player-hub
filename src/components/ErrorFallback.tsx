import { WifiOff } from "lucide-react";

export default function ErrorFallback({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <WifiOff className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground">Verbinding mislukt</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {message || "Kan geen verbinding maken met het radiostation. Probeer het later opnieuw."}
      </p>
    </div>
  );
}

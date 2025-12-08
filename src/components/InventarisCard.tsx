import { InventarisItem } from "@/data/inventaris";
import { cn } from "@/lib/utils";
import { Package, Monitor, Keyboard, Mouse, Laptop, Headphones } from "lucide-react";

interface InventarisCardProps {
  item: InventarisItem;
  index: number;
  state?: "default" | "comparing" | "sorted" | "active" | "found" | "eliminated";
  showIndex?: boolean;
  compact?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Monitor: Monitor,
  Keyboard: Keyboard,
  Mouse: Mouse,
  Laptop: Laptop,
  Headset: Headphones,
};

export const InventarisCard = ({
  item,
  index,
  state = "default",
  showIndex = true,
  compact = false,
}: InventarisCardProps) => {
  const Icon = iconMap[item.nama] || Package;

  const stateStyles = {
    default: "bg-card border-border",
    comparing: "bg-warning/20 border-warning glow-warning animate-compare",
    sorted: "bg-success/20 border-success glow-success",
    active: "bg-primary/20 border-primary glow-primary",
    found: "bg-success/20 border-success glow-success animate-found",
    eliminated: "bg-card/30 border-border/30 opacity-40",
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (compact) {
    return (
      <div
        className={cn(
          "relative p-3 rounded-lg border-2 transition-all duration-300",
          stateStyles[state]
        )}
      >
        {showIndex && (
          <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-mono font-bold">
            {index}
          </span>
        )}
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">{item.nama}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all duration-300",
        stateStyles[state]
      )}
    >
      {showIndex && (
        <span className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-sm font-mono font-bold text-primary">
          {index}
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{item.nama}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{item.jenis}</p>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-muted-foreground">
              Stok: <span className="text-foreground font-medium">{item.stok}</span>
            </span>
            <span className="text-primary font-medium">{formatPrice(item.harga)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

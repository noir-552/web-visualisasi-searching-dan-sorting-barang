import { inventarisData } from "@/data/inventaris";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Monitor, Keyboard, Mouse, Laptop, Headphones } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Monitor: Monitor,
  Keyboard: Keyboard,
  Mouse: Mouse,
  Laptop: Laptop,
  Headset: Headphones,
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export const DataTable = () => {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="text-muted-foreground font-semibold">Nama</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Jenis</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-right">Stok</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-right">Harga</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventarisData.map((item, idx) => {
            const Icon = iconMap[item.nama] || Package;
            return (
              <TableRow 
                key={idx} 
                className="hover:bg-secondary/30 transition-colors"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    {item.nama}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md bg-secondary text-xs">
                    {item.jenis}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono">{item.stok}</TableCell>
                <TableCell className="text-right font-mono text-primary">
                  {formatPrice(item.harga)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

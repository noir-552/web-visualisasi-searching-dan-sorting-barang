import { InventarisItem } from "@/data/inventaris";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, Monitor, Keyboard, Mouse, Laptop, Headphones, Trash2 } from "lucide-react";

interface DataTableProps {
  data: InventarisItem[];
  onDelete?: (index: number) => void;
}

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

export const DataTable = ({ data, onDelete }: DataTableProps) => {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="text-muted-foreground font-semibold">Nama</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Jenis</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-right">Stok</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-right">Harga</TableHead>
            {onDelete && (
              <TableHead className="text-muted-foreground font-semibold w-16"></TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={onDelete ? 5 : 4} className="text-center py-8 text-muted-foreground">
                Belum ada data inventaris
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, idx) => {
              const Icon = iconMap[item.nama] || Package;
              return (
                <TableRow 
                  key={idx} 
                  className="hover:bg-secondary/30 transition-colors"
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
                  {onDelete && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(idx)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

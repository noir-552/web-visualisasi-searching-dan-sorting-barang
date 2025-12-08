import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { InventarisItem } from "@/data/inventaris";
import { toast } from "sonner";

const itemSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi").max(50, "Nama maksimal 50 karakter"),
  jenis: z.string().trim().min(1, "Jenis wajib dipilih"),
  stok: z.coerce.number().int().min(0, "Stok minimal 0").max(99999, "Stok maksimal 99999"),
  harga: z.coerce.number().int().min(0, "Harga minimal 0").max(999999999, "Harga maksimal 999.999.999"),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface AddItemDialogProps {
  onAdd: (item: InventarisItem) => void;
}

const jenisOptions = ["Periferal", "Komputer", "Audio", "Jaringan", "Penyimpanan", "Lainnya"];

export const AddItemDialog = ({ onAdd }: AddItemDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      nama: "",
      jenis: "",
      stok: 0,
      harga: 0,
    },
  });

  const onSubmit = (data: ItemFormData) => {
    onAdd({
      nama: data.nama,
      jenis: data.jenis,
      stok: data.stok,
      harga: data.harga,
    });
    toast.success(`"${data.nama}" berhasil ditambahkan!`);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="w-4 h-4" />
          Tambah Item
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Tambah Item Baru</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Nama Barang</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Contoh: Speaker"
                      className="bg-secondary border-border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jenis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Jenis</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Pilih jenis barang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jenisOptions.map((jenis) => (
                        <SelectItem key={jenis} value={jenis}>
                          {jenis}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Stok</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        min={0}
                        className="bg-secondary border-border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="harga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Harga (Rp)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        min={0}
                        className="bg-secondary border-border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="border-border"
              >
                Batal
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Tambah
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

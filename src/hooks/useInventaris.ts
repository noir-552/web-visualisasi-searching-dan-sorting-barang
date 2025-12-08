import { useState, useCallback } from "react";
import { InventarisItem, inventarisData } from "@/data/inventaris";
import { toast } from "sonner";

export const useInventaris = () => {
  const [items, setItems] = useState<InventarisItem[]>([...inventarisData]);

  const addItem = useCallback((item: InventarisItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const deleteItem = useCallback((index: number) => {
    setItems((prev) => {
      const item = prev[index];
      if (item) {
        toast.success(`"${item.nama}" berhasil dihapus`);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const resetItems = useCallback(() => {
    setItems([...inventarisData]);
    toast.info("Data dikembalikan ke awal");
  }, []);

  return {
    items,
    addItem,
    deleteItem,
    resetItems,
  };
};

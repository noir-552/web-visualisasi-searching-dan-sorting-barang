export interface InventarisItem {
  nama: string;
  stok: number;
  harga: number;
  jenis: string;
}

export const inventarisData: InventarisItem[] = [
  { nama: "Monitor", stok: 10, harga: 1500000, jenis: "Periferal" },
  { nama: "Keyboard", stok: 25, harga: 250000, jenis: "Periferal" },
  { nama: "Mouse", stok: 40, harga: 150000, jenis: "Periferal" },
  { nama: "Laptop", stok: 5, harga: 9000000, jenis: "Komputer" },
  { nama: "Headset", stok: 15, harga: 350000, jenis: "Audio" },
];

export type SortField = "nama" | "jenis" | "harga" | "stok";

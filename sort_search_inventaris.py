# SISTEM INVENTARIS DENGAN MERGE SORT DAN BINARY SEARCH
# Fitur: Sorting & Searching berdasar Nama dan Jenis Barang

# Contoh data inventaris dengan field 'jenis'
inventaris = [
    {"nama": "Monitor", "stok": 10, "harga": 1500000, "jenis": "Periferal"},
    {"nama": "Keyboard", "stok": 25, "harga": 250000, "jenis": "Periferal"},
    {"nama": "Mouse", "stok": 40, "harga": 150000, "jenis": "Periferal"},
    {"nama": "Laptop", "stok": 5, "harga": 9000000, "jenis": "Komputer"},
    {"nama": "Headset", "stok": 15, "harga": 350000, "jenis": "Audio"},
]

# 1. MERGE SORT REKURSIF - Bisa berdasar nama, jenis, harga, atau stok
def merge_sort_inventaris(arr, sort_by="nama"):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort_inventaris(arr[:mid], sort_by)
    right = merge_sort_inventaris(arr[mid:], sort_by)

    return merge_inventaris(left, right, sort_by)


def merge_inventaris(left, right, sort_by="nama"):
    i = j = 0
    result = []

    while i < len(left) and j < len(right):
        # Bandingkan berdasarkan field yang dipilih
        if left[i][sort_by] <= right[j][sort_by]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Tambahkan sisa elemen
    result.extend(left[i:])
    result.extend(right[j:])
    return result


# 2. BINARY SEARCH REKURSIF - Bisa berdasar nama atau jenis
def binary_search_inventaris(arr, target_value, search_by="nama", low=0, high=None):
    if high is None:
        high = len(arr) - 1

    if low > high:
        return -1

    mid = (low + high) // 2
    value_mid = arr[mid][search_by]

    if value_mid == target_value:
        return mid
    elif target_value < value_mid:
        return binary_search_inventaris(arr, target_value, search_by, low, mid - 1)
    else:
        return binary_search_inventaris(arr, target_value, search_by, mid + 1, high)


# 3. FUNGSI PENCARIAN SEMUA BARANG (Linear Search)
def cari_semua_barang(arr, target_value, search_by="nama"):
    hasil = []
    for i, item in enumerate(arr):
        if item[search_by] == target_value:
            hasil.append((i, item))
    return hasil


# ============= PROGRAM UTAMA =============
if __name__ == "__main__":
    
    print("=" * 60)
    print("SISTEM MANAJEMEN INVENTARIS BARANG")
    print("=" * 60)
    
    print("\n=== DATA INVENTARIS AWAL ===")
    for item in inventaris:
        print(f"{item['nama']:12} | Jenis: {item['jenis']:12} | Stok: {item['stok']:3} | Harga: Rp {item['harga']:,}")

    # SORTING BERDASAR NAMA
    print("\n" + "=" * 60)
    print("=== SORTING BERDASAR NAMA (A-Z) ===")
    print("=" * 60)
    inventaris_sorted_nama = merge_sort_inventaris(inventaris.copy(), sort_by="nama")
    for item in inventaris_sorted_nama:
        print(f"{item['nama']:12} | Jenis: {item['jenis']:12} | Stok: {item['stok']:3} | Harga: Rp {item['harga']:,}")

    # SORTING BERDASAR JENIS
    print("\n" + "=" * 60)
    print("=== SORTING BERDASAR JENIS ===")
    print("=" * 60)
    inventaris_sorted_jenis = merge_sort_inventaris(inventaris.copy(), sort_by="jenis")
    for item in inventaris_sorted_jenis:
        print(f"{item['nama']:12} | Jenis: {item['jenis']:12} | Stok: {item['stok']:3} | Harga: Rp {item['harga']:,}")

    # PENCARIAN BY NAMA (Binary Search)
    print("\n" + "=" * 60)
    print("=== PENCARIAN BARANG BERDASAR NAMA ===")
    print("=" * 60)
    target_nama = "Laptop"
    print(f"Mencari barang: '{target_nama}'...")
    idx = binary_search_inventaris(inventaris_sorted_nama, target_nama, search_by="nama")
    if idx != -1:
        item = inventaris_sorted_nama[idx]
        print(f"✓ DITEMUKAN di index {idx}")
        print(f"  Nama   : {item['nama']}")
        print(f"  Jenis  : {item['jenis']}")
        print(f"  Stok   : {item['stok']} unit")
        print(f"  Harga  : Rp {item['harga']:,}")
    else:
        print(f"✗ Barang '{target_nama}' tidak ditemukan")

    # PENCARIAN BY JENIS (Binary Search - 1 hasil)
    print("\n" + "=" * 60)
    print("=== PENCARIAN BARANG BERDASAR JENIS (Binary Search) ===")
    print("=" * 60)
    target_jenis = "Audio"
    print(f"Mencari barang jenis: '{target_jenis}'...")
    idx = binary_search_inventaris(inventaris_sorted_jenis, target_jenis, search_by="jenis")
    if idx != -1:
        item = inventaris_sorted_jenis[idx]
        print(f"✓ DITEMUKAN di index {idx}")
        print(f"  Nama   : {item['nama']}")
        print(f"  Jenis  : {item['jenis']}")
        print(f"  Stok   : {item['stok']} unit")
        print(f"  Harga  : Rp {item['harga']:,}")
    else:
        print(f"✗ Barang jenis '{target_jenis}' tidak ditemukan")

    # PENCARIAN SEMUA BY JENIS (Linear Search - semua hasil)
    print("\n" + "=" * 60)
    print("=== PENCARIAN SEMUA BARANG BERDASAR JENIS ===")
    print("=" * 60)
    target_jenis_all = "Periferal"
    print(f"Mencari semua barang jenis: '{target_jenis_all}'...\n")
    hasil = cari_semua_barang(inventaris_sorted_jenis, target_jenis_all, search_by="jenis")
    if hasil:
        print(f"✓ Ditemukan {len(hasil)} barang dengan jenis '{target_jenis_all}':\n")
        for idx, item in hasil:
            print(f"  [{idx}] {item['nama']:12} | Stok: {item['stok']:3} | Harga: Rp {item['harga']:,}")
    else:
        print(f"✗ Barang jenis '{target_jenis_all}' tidak ditemukan")

    print("\n" + "=" * 60)
    print("PROGRAM SELESAI")
    print("=" * 60)

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MergeSortVisualization } from "@/components/MergeSortVisualization";
import { BinarySearchVisualization } from "@/components/BinarySearchVisualization";
import { DataTable } from "@/components/DataTable";
import { CodeBlock } from "@/components/CodeBlock";
import { ArrowUpDown, Search, Database, Code2, Sparkles } from "lucide-react";

const mergeSortCode = `def merge_sort_inventaris(arr, sort_by="nama"):
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
        if left[i][sort_by] <= right[j][sort_by]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result`;

const binarySearchCode = `def binary_search_inventaris(arr, target, search_by="nama", low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low > high:
        return -1  # Tidak ditemukan
    
    mid = (low + high) // 2
    value_mid = arr[mid][search_by]
    
    if value_mid == target:
        return mid  # Ditemukan!
    elif target < value_mid:
        return binary_search_inventaris(arr, target, search_by, low, mid - 1)
    else:
        return binary_search_inventaris(arr, target, search_by, mid + 1, high)`;

const Index = () => {
  const [activeTab, setActiveTab] = useState("data");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-mono text-muted-foreground">
              Algorithm Visualization
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Sistem Inventaris
            <span className="text-primary"> Interaktif</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Visualisasi algoritma <span className="text-primary font-medium">Merge Sort</span> dan{" "}
            <span className="text-accent font-medium">Binary Search</span> untuk manajemen data inventaris barang.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
              <ArrowUpDown className="w-4 h-4 text-primary" />
              <span className="text-sm">Merge Sort O(n log n)</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
              <Search className="w-4 h-4 text-accent" />
              <span className="text-sm">Binary Search O(log n)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-secondary/50 border border-border p-1 rounded-xl">
            <TabsTrigger 
              value="data" 
              className="data-[state=active]:bg-card data-[state=active]:text-foreground rounded-lg gap-2"
            >
              <Database className="w-4 h-4" />
              Data
            </TabsTrigger>
            <TabsTrigger 
              value="merge-sort"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground rounded-lg gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              Merge Sort
            </TabsTrigger>
            <TabsTrigger 
              value="binary-search"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground rounded-lg gap-2"
            >
              <Search className="w-4 h-4" />
              Binary Search
            </TabsTrigger>
            <TabsTrigger 
              value="code"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground rounded-lg gap-2"
            >
              <Code2 className="w-4 h-4" />
              Kode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Data Inventaris</h2>
              <p className="text-muted-foreground">
                Data awal yang digunakan dalam visualisasi algoritma sorting dan searching.
              </p>
            </div>
            <DataTable />
          </TabsContent>

          <TabsContent value="merge-sort" className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Merge Sort Visualization</h2>
              <p className="text-muted-foreground">
                Lihat bagaimana algoritma Merge Sort membagi dan menggabungkan array secara rekursif.
              </p>
            </div>
            <MergeSortVisualization />
          </TabsContent>

          <TabsContent value="binary-search" className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Binary Search Visualization</h2>
              <p className="text-muted-foreground">
                Lihat bagaimana Binary Search mencari item dengan membagi area pencarian menjadi dua.
              </p>
            </div>
            <BinarySearchVisualization />
          </TabsContent>

          <TabsContent value="code" className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Source Code</h2>
              <p className="text-muted-foreground">
                Implementasi Python dari algoritma yang divisualisasikan.
              </p>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-primary" />
                  Merge Sort
                </h3>
                <CodeBlock 
                  code={mergeSortCode} 
                  title="merge_sort.py" 
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Search className="w-4 h-4 text-accent" />
                  Binary Search
                </h3>
                <CodeBlock 
                  code={binarySearchCode} 
                  title="binary_search.py" 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Visualisasi Algoritma Sorting & Searching • Sistem Inventaris
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

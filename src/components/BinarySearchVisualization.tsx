import { useState, useEffect, useCallback } from "react";
import { InventarisItem, SortField } from "@/data/inventaris";
import { InventarisCard } from "./InventarisCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, SkipForward, Search, Zap } from "lucide-react";

interface BinarySearchVisualizationProps {
  data: InventarisItem[];
}

interface SearchStep {
  array: InventarisItem[];
  low: number;
  high: number;
  mid: number;
  description: string;
  found?: boolean;
  eliminated: number[];
}

const mergeSort = (arr: InventarisItem[], sortBy: SortField): InventarisItem[] => {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), sortBy);
  const right = mergeSort(arr.slice(mid), sortBy);
  const result: InventarisItem[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i][sortBy] <= right[j][sortBy]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
};

const generateBinarySearchSteps = (
  arr: InventarisItem[],
  target: string,
  searchBy: "nama" | "jenis"
): SearchStep[] => {
  const steps: SearchStep[] = [];
  const sortedArr = mergeSort([...arr], searchBy);
  let low = 0;
  let high = sortedArr.length - 1;
  const eliminated: number[] = [];

  steps.push({
    array: sortedArr,
    low,
    high,
    mid: Math.floor((low + high) / 2),
    description: `Data sudah diurutkan berdasarkan ${searchBy}. Mencari "${target}"...`,
    eliminated: [],
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midValue = sortedArr[mid][searchBy];

    if (midValue === target) {
      steps.push({
        array: sortedArr,
        low,
        high,
        mid,
        description: `✓ Ditemukan! "${target}" ada di index ${mid}`,
        found: true,
        eliminated: [...eliminated],
      });
      return steps;
    }

    steps.push({
      array: sortedArr,
      low,
      high,
      mid,
      description: `Memeriksa index ${mid}: "${midValue}" ${
        target < midValue ? ">" : "<"
      } "${target}"`,
      eliminated: [...eliminated],
    });

    if (target < midValue) {
      for (let i = mid; i <= high; i++) {
        eliminated.push(i);
      }
      high = mid - 1;
      steps.push({
        array: sortedArr,
        low,
        high,
        mid: Math.floor((low + high) / 2),
        description: `Target lebih kecil, eliminasi bagian kanan (index ${mid}-${mid + (high - low + 1)})`,
        eliminated: [...eliminated],
      });
    } else {
      for (let i = low; i <= mid; i++) {
        eliminated.push(i);
      }
      low = mid + 1;
      steps.push({
        array: sortedArr,
        low,
        high,
        mid: Math.floor((low + high) / 2),
        description: `Target lebih besar, eliminasi bagian kiri (index ${low - 1 - (mid - low)}-${mid})`,
        eliminated: [...eliminated],
      });
    }
  }

  steps.push({
    array: sortedArr,
    low,
    high,
    mid: -1,
    description: `✗ "${target}" tidak ditemukan dalam data`,
    eliminated: [...eliminated],
  });

  return steps;
};

export const BinarySearchVisualization = ({ data }: BinarySearchVisualizationProps) => {
  const [searchBy, setSearchBy] = useState<"nama" | "jenis">("nama");
  const [searchTarget, setSearchTarget] = useState("");
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const suggestions = searchBy === "nama" 
    ? data.map(i => i.nama)
    : [...new Set(data.map(i => i.jenis))];

  useEffect(() => {
    if (suggestions.length > 0 && !searchTarget) {
      setSearchTarget(suggestions[0]);
    }
  }, [data, searchBy]);

  const initializeSearch = useCallback(() => {
    if (!searchTarget.trim() || data.length === 0) {
      setSteps([]);
      return;
    }
    const newSteps = generateBinarySearchSteps(data, searchTarget, searchBy);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [searchTarget, searchBy, data]);

  useEffect(() => {
    initializeSearch();
  }, [initializeSearch]);

  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const currentStepData = steps[currentStep];

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground rounded-xl border border-border">
        Tambahkan item inventaris untuk melihat visualisasi Binary Search
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Search by:</span>
          <Select value={searchBy} onValueChange={(v) => setSearchBy(v as "nama" | "jenis")}>
            <SelectTrigger className="w-28 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nama">Nama</SelectItem>
              <SelectItem value="jenis">Jenis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTarget}
            onChange={(e) => setSearchTarget(e.target.value)}
            placeholder={`Cari ${searchBy}...`}
            className="bg-secondary border-border"
          />
        </div>

        <Button
          onClick={initializeSearch}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Search
        </Button>
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground">Coba:</span>
        {suggestions.slice(0, 6).map((s) => (
          <button
            key={s}
            onClick={() => setSearchTarget(s)}
            className="text-xs px-2 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Playback controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="border-border hover:bg-secondary"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            onClick={handlePlayPause}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            disabled={steps.length === 0}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentStep >= steps.length - 1}
            className="border-border hover:bg-secondary"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-muted-foreground" />
          <Select value={speed.toString()} onValueChange={(v) => setSpeed(Number(v))}>
            <SelectTrigger className="w-24 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2000">0.5x</SelectItem>
              <SelectItem value="1000">1x</SelectItem>
              <SelectItem value="500">2x</SelectItem>
              <SelectItem value="250">4x</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {steps.length > 0 && (
          <div className="ml-auto text-sm text-muted-foreground font-mono">
            Step {currentStep + 1} / {steps.length}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {steps.length > 0 && (
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      )}

      {/* Description */}
      {currentStepData && (
        <div className="p-4 rounded-xl glass">
          <p className="text-sm font-mono text-foreground">
            {currentStepData.description}
          </p>
          {!currentStepData.found && currentStepData.mid >= 0 && (
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground font-mono">
              <span>low: {currentStepData.low}</span>
              <span>mid: {currentStepData.mid}</span>
              <span>high: {currentStepData.high}</span>
            </div>
          )}
        </div>
      )}

      {/* Visualization */}
      {currentStepData && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {currentStepData.array.map((item, idx) => {
            let state: "default" | "comparing" | "active" | "found" | "eliminated" = "default";
            
            if (currentStepData.eliminated.includes(idx)) {
              state = "eliminated";
            } else if (currentStepData.found && idx === currentStepData.mid) {
              state = "found";
            } else if (idx === currentStepData.mid) {
              state = "comparing";
            } else if (idx >= currentStepData.low && idx <= currentStepData.high) {
              state = "active";
            }

            return (
              <div key={`${item.nama}-${idx}`} className="relative">
                <InventarisCard
                  item={item}
                  index={idx}
                  state={state}
                />
                {idx === currentStepData.mid && !currentStepData.found && currentStepData.mid >= 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-warning">
                    ▼ mid
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Algorithm explanation */}
      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Tentang Binary Search
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Binary Search adalah algoritma pencarian dengan kompleksitas waktu O(log n). 
          Algoritma ini bekerja pada data yang sudah terurut dengan membagi area pencarian menjadi dua 
          pada setiap iterasi, sehingga sangat efisien untuk dataset besar.
        </p>
      </div>
    </div>
  );
};

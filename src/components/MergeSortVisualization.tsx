import { useState, useEffect, useCallback } from "react";
import { InventarisItem, SortField } from "@/data/inventaris";
import { InventarisCard } from "./InventarisCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, SkipForward, Zap } from "lucide-react";

interface MergeSortVisualizationProps {
  data: InventarisItem[];
}

interface SortStep {
  arrays: InventarisItem[][];
  description: string;
  comparing?: [number, number];
  level: number;
}

const generateMergeSortSteps = (
  arr: InventarisItem[],
  sortBy: SortField
): SortStep[] => {
  const steps: SortStep[] = [];
  
  const mergeSort = (
    array: InventarisItem[],
    level: number
  ): InventarisItem[] => {
    if (array.length <= 1) {
      return array;
    }

    const mid = Math.floor(array.length / 2);
    const left = array.slice(0, mid);
    const right = array.slice(mid);

    steps.push({
      arrays: [left, right],
      description: `Membagi array menjadi 2 bagian: [${left.map(i => i.nama).join(", ")}] dan [${right.map(i => i.nama).join(", ")}]`,
      level,
    });

    const sortedLeft = mergeSort(left, level + 1);
    const sortedRight = mergeSort(right, level + 1);

    return merge(sortedLeft, sortedRight, level);
  };

  const merge = (
    left: InventarisItem[],
    right: InventarisItem[],
    level: number
  ): InventarisItem[] => {
    const result: InventarisItem[] = [];
    let i = 0,
      j = 0;

    while (i < left.length && j < right.length) {
      steps.push({
        arrays: [left, right],
        description: `Membandingkan ${left[i].nama} (${left[i][sortBy]}) dengan ${right[j].nama} (${right[j][sortBy]})`,
        comparing: [i, j],
        level,
      });

      if (left[i][sortBy] <= right[j][sortBy]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    const merged = [...result, ...left.slice(i), ...right.slice(j)];
    
    steps.push({
      arrays: [merged],
      description: `Hasil merge: [${merged.map(i => i.nama).join(", ")}]`,
      level,
    });

    return merged;
  };

  steps.push({
    arrays: [arr],
    description: "Array awal sebelum sorting",
    level: 0,
  });

  const sorted = mergeSort([...arr], 0);

  steps.push({
    arrays: [sorted],
    description: "✓ Sorting selesai!",
    level: 0,
  });

  return steps;
};

export const MergeSortVisualization = ({ data }: MergeSortVisualizationProps) => {
  const [sortBy, setSortBy] = useState<SortField>("nama");
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const initializeSteps = useCallback(() => {
    if (data.length === 0) {
      setSteps([]);
      return;
    }
    const newSteps = generateMergeSortSteps(data, sortBy);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [sortBy, data]);

  useEffect(() => {
    initializeSteps();
  }, [initializeSteps]);

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
        Tambahkan item inventaris untuk melihat visualisasi Merge Sort
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortField)}>
            <SelectTrigger className="w-32 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nama">Nama</SelectItem>
              <SelectItem value="jenis">Jenis</SelectItem>
              <SelectItem value="harga">Harga</SelectItem>
              <SelectItem value="stok">Stok</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

        <div className="ml-auto text-sm text-muted-foreground font-mono">
          Step {currentStep + 1} / {steps.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Description */}
      {currentStepData && (
        <div className="p-4 rounded-xl glass">
          <p className="text-sm font-mono text-foreground">
            {currentStepData.description}
          </p>
        </div>
      )}

      {/* Visualization */}
      {currentStepData && (
        <div className="space-y-4">
          {currentStepData.arrays.map((arr, arrIdx) => (
            <div key={arrIdx} className="space-y-2">
              {currentStepData.arrays.length > 1 && (
                <span className="text-xs font-mono text-muted-foreground">
                  {arrIdx === 0 ? "Left" : "Right"} Array
                </span>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {arr.map((item, idx) => {
                  let state: "default" | "comparing" | "sorted" | "active" = "default";
                  if (currentStepData.comparing) {
                    if (arrIdx === 0 && idx === currentStepData.comparing[0]) {
                      state = "comparing";
                    }
                    if (arrIdx === 1 && idx === currentStepData.comparing[1]) {
                      state = "comparing";
                    }
                  }
                  if (currentStep === steps.length - 1) {
                    state = "sorted";
                  }
                  return (
                    <InventarisCard
                      key={`${item.nama}-${idx}`}
                      item={item}
                      index={idx}
                      state={state}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Algorithm explanation */}
      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Tentang Merge Sort
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Merge Sort adalah algoritma divide-and-conquer dengan kompleksitas waktu O(n log n). 
          Algoritma ini membagi array menjadi dua bagian, mengurutkan masing-masing bagian secara rekursif, 
          lalu menggabungkan hasilnya.
        </p>
      </div>
    </div>
  );
};

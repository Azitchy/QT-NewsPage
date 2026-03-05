import { useMemo } from "react";
import { Range } from "react-range";
import RightSideModal from "@/components/ui/atm/rightSideModal";
import { Tally3 } from "lucide-react";

type RangeValue = [number, number];

interface GalaxyFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    pr: RangeValue;
    gameLevel: RangeValue;
    leaderboard: RangeValue;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      pr: RangeValue;
      gameLevel: RangeValue;
      leaderboard: RangeValue;
    }>
  >;
}

const STEP = 1;

export default function GalaxyFilterModal({
  isOpen,
  onClose,
  filters,
  setFilters,
}: GalaxyFilterModalProps) {
  const histogram = useMemo(
    () =>
      Array.from({ length: 28 }).map(() => Math.floor(Math.random() * 40) + 10),
    [],
  );

  const RangeSection = ({
    title,
    value,
    min,
    max,
    onChange,
  }: {
    title: string;
    value: RangeValue;
    min: number;
    max: number;
    onChange: (val: RangeValue) => void;
  }) => {
    const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

    return (
      <div className="space-y-5 overflow-hidden">
        <h3 className="body-text1-400 text-foreground">{title}</h3>

        {/* Histogram + Slider */}
        <div className="relative h-10 px-4">
          {/* Histogram */}
          <div className="absolute inset-0 flex items-end gap-[3px]">
            {histogram.map((h, i) => {
              const percent = (i / histogram.length) * 100;

              const isActive =
                percent >= getPercent(value[0]) &&
                percent <= getPercent(value[1]);

              return (
                <div
                  key={i}
                  style={{ height: `${h}px` }}
                  className={`flex-1 rounded-[2px] transition-colors ${
                    isActive ? "bg-[#62C669]" : "bg-[#E5E5E5]"
                  }`}
                />
              );
            })}
          </div>

          {/* Range Slider */}
          <Range
            values={value}
            step={STEP}
            min={min}
            max={max}
            onChange={(vals) => {
              const sorted = [
                Math.min(vals[0], vals[1]),
                Math.max(vals[0], vals[1]),
              ] as RangeValue;
              onChange(sorted);
            }}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="absolute left-2 right-2 bottom-0 translate-y-1/2 h-8 flex items-center"
              >
                <div className="relative w-full h-1 bg-[#E5E5E5] rounded-full">
                  <div
                    className="absolute h-1 rounded-full bg-[#62C669]"
                    style={{
                      left: `${getPercent(value[0])}%`,
                      width: `${getPercent(value[1]) - getPercent(value[0])}%`,
                    }}
                  />
                </div>
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                className="h-7 w-7 flex items-center justify-center rounded-full shadow-md cursor-grab active:cursor-grabbing"
                style={{
                  ...props.style,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E2E2",
                }}
              >
                <Tally3
                  size={14}
                  strokeWidth={2.5}
                  className="text-[#787878]"
                />
              </div>
            )}
          />
        </div>

        {/* Min / Max Inputs */}
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-[#787878] text-xs mb-1">Minimum</p>
            <input
              type="number"
              value={value[0]}
              onChange={(e) =>
                onChange([Math.max(min, +e.target.value), value[1]])
              }
              className="border border-[#E5E5E5] rounded-full px-4 py-2 text-center text-sm outline-none w-auto max-w-[90px]"
            />
          </div>

          <div className="text-right">
            <p className="text-[#787878] text-xs mb-1">Maximum</p>
            <input
              type="number"
              value={value[1]}
              onChange={(e) =>
                onChange([value[0], Math.min(max, +e.target.value)])
              }
              className="border border-[#E5E5E5] rounded-full px-4 py-2 text-center text-sm outline-none w-auto max-w-[90px]"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <RightSideModal
      isOpen={isOpen}
      onClose={onClose}
      title="ATM Galaxy filters"
      primaryButtonText="Apply filters"
      secondaryButtonText="Reset filters"
      onPrimaryClick={onClose}
      onSecondaryClick={() =>
        setFilters({
          pr: [0, 1700],
          gameLevel: [0, 15000],
          leaderboard: [0, 150],
        })
      }
    >
      <div className="space-y-10">
        <RangeSection
          title="PR level"
          value={filters.pr}
          min={0}
          max={1700}
          onChange={(val) => setFilters((prev) => ({ ...prev, pr: val }))}
        />

        <RangeSection
          title="Game level"
          value={filters.gameLevel}
          min={0}
          max={15000}
          onChange={(val) =>
            setFilters((prev) => ({
              ...prev,
              gameLevel: val,
            }))
          }
        />

        <RangeSection
          title="Position on the leaderboard"
          value={filters.leaderboard}
          min={0}
          max={150}
          onChange={(val) =>
            setFilters((prev) => ({
              ...prev,
              leaderboard: val,
            }))
          }
        />
      </div>
    </RightSideModal>
  );
}

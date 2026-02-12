import { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useGetAllGames } from "@/hooks/useApi";
import { Dropdown } from "@/components/ui/atm/dropdown";
import GameCard from "./components/GameCard";

export default function Games() {
  const { data: gamesResponse, loading, execute } = useGetAllGames();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    execute();
  }, []);

  const games = gamesResponse?.data || [];

  // Derive unique categories from games
  const categoryOptions = useMemo(() => {
    const categories = new Set(games.map((g) => g.category).filter(Boolean));
    return [
      { label: "All", value: "all" },
      ...Array.from(categories).map((c) => ({ label: c, value: c })),
    ];
  }, [games]);

  // Filter games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch =
        !search ||
        game.title.toLowerCase().includes(search.toLowerCase()) ||
        game.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !selectedCategory ||
        selectedCategory === "all" ||
        game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, search, selectedCategory]);

  // Recent games — take first 3 sorted by updatedAt
  const recentGames = useMemo(() => {
    return [...games]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 3);
  }, [games]);

  return (
    <div className="space-y-[20px]">
      {/* Recent Games */}
      {recentGames.length > 0 && (
        <div>
          <h3 className="font-h4-400 text-foreground mb-[16px]">
            Recent games
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[16px]">
            {recentGames.map((game) => (
              <GameCard key={`recent-${game.id}`} game={game} />
            ))}
          </div>
        </div>
      )}

      {/* All Games */}
      <div>
        <div className="flex items-center justify-between mb-[16px]">
          <h3 className="font-h4-400 text-foreground">All games</h3>
          <div className="flex items-center gap-[12px]">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#959595]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-[36px] pr-[16px] py-[10px] rounded-[30px] border border-[#EBEBEB] body-text2-400 text-foreground focus:outline-none focus:border-primary w-[200px]"
              />
            </div>
            {/* Category filter */}
            <Dropdown
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Category"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-[60px]">
            <div className="w-[28px] h-[28px] border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="py-[60px] text-center">
            <p className="body-text2-400 text-[#959595]">
              {search || selectedCategory !== "all"
                ? "No games match your filters"
                : "No games available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[16px]">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

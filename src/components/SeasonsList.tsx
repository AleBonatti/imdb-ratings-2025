import { Season } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface SeasonsListProps {
    seasons: Array<Season>;
    onSelectSeason: (season: Season) => void;
    loading: boolean;
}

function SeasonsList({ seasons, onSelectSeason, loading }: SeasonsListProps) {
    if (loading) {
        return (
            <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                <Loader2 className="animate-spin" />
                Caricamento stagioni...
            </div>
        );
    }

    return (
        <ul className="text-sm mt-6 space-y-3">
            {seasons.map((season, index) => (
                <li key={index} className="flex justify-between items-center py-2 px-3 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-muted shadow-sm border">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onSelectSeason(season);
                        }}
                        className="hover:underline font-semibold">
                        <span>Stagione {season.season}</span>
                    </a>
                    <Badge variant="secondary">{season.episodes} episodi</Badge>
                </li>
            ))}
        </ul>
    );
}

export default SeasonsList;

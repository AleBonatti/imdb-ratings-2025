import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Show {
    id: string;
    type: string;
    title: string;
    original_title: string;
    start_year: string;
    end_year: string;
    genres: string;
}

interface Season {
    season: string;
    episodes: string;
}

interface SeasonsListProps {
    show: Show;
    items: Array<Season>;
    onSelectSeason: (season: Season) => void;
    loading: boolean;
}

function SeasonsList({ show, items, onSelectSeason, loading }: SeasonsListProps) {
    if (loading) {
        return (
            <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                <Loader2 className="animate-spin" />
                Caricamento stagioni...
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-lg">
                <span className="font-semibold">{show.title}</span> ({show.original_title})
            </h2>
            <h3 className="text-base">
                {show.type} [{show.start_year} - {show.end_year}]
            </h3>
            <ul className="text-sm mt-6 space-y-3">
                {items.map((season, index) => (
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
        </div>
    );
}

export default SeasonsList;

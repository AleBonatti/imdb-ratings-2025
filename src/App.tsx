import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import api from "./axios";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";

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
interface Episode {
    num: string;
    title: string;
    rate: number;
    votes: number;
}

function SeasonsList({ show, items, onSelectSeason }: { show: Show; items: Array<Season>; onSelectSeason: (season: Season) => void }) {
    return (
        <div>
            <h2>
                {show.title} ({show.original_title})
            </h2>
            <h3>
                {show.start_year} - {show.end_year}
            </h3>
            <ul className="p-1 text-sm mt-6">
                {items.map((season, index) => (
                    <li key={index} className="flex px-2 py-1 hover:bg-light-gray">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onSelectSeason(season);
                            }}
                            className="hover:underline">
                            Stagione {season.season}
                        </a>
                        <span className="text-light-gray">({season.episodes} episodes)</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function EpisodesList({ items, loading }: { items: Array<Episode>; loading: boolean }) {
    if (loading) {
        return (
            <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                <Loader2 className="animate-spin" />
                Caricamento episodi...
            </div>
        );
    }

    if (items.length === 0) {
        return <div className="mt-4 text-muted-foreground italic">Nessun episodio trovato per questa stagione.</div>;
    }

    return (
        <ul className="p-1 text-sm mt-6">
            {items.map((episode, index) => (
                <li key={index} className="flex px-2 py-1 hover:bg-light-gray">
                    <a href="#">
                        Episodio {episode.num}: {episode.title}. Rate: {episode.rate} ({episode.votes} votes).
                    </a>
                </li>
            ))}
        </ul>
    );
}

function App() {
    const [open, setOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [shows, setShows] = useState<Show[]>([]);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [episodesLoading, setEpisodesLoading] = useState(false);

    function handleQueryInput(event: React.ChangeEvent<HTMLInputElement>): void {
        setQuery(event.target.value);
    }

    useEffect(() => {
        if (query) {
            setLoading(true);
            const delayDebounce = setTimeout(() => {
                api.get(`/search?q=${encodeURIComponent(query)}`)
                    .then((res) => {
                        const results = res.data.items.map((item: any) => ({
                            id: item.id,
                            type: item.type,
                            title: item.title,
                            original_title: item.original_title,
                            start_year: item.start_year,
                            end_year: item.end_year,
                        }));
                        setShows(results);
                    })
                    .catch((err) => {
                        console.error(err);
                        setShows([]);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }, 300); // debounce di 300ms

            return () => clearTimeout(delayDebounce);
        } else {
            setShows([]);
        }
    }, [query]);

    function handleClick(e: React.MouseEvent<HTMLAnchorElement>, item: Show): void {
        e.preventDefault();
        setSelectedShow(item);

        api.get(`/show/${item.id}/seasons`)
            .then((res) => {
                const results = res.data.items.map((item: any) => ({
                    season: item.season,
                    episodes: item.episodes,
                }));
                setSeasons(results);
                setOpen(false);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function handleSeasonSelect(season: Season) {
        if (!selectedShow) return;

        setEpisodes([]);
        setEpisodesLoading(true);

        api.get(`/ratings/${selectedShow.id}?season=${season.season}`)
            .then((res) => {
                const results = res.data.items.map((item: any) => ({
                    num: item.episode,
                    title: item.title,
                    rate: item.rate,
                    votes: item.votes,
                }));
                setEpisodes(results);
            })
            .catch((err) => {
                console.error(err);
                setEpisodes([]);
            })
            .finally(() => {
                setEpisodesLoading(false);
            });
    }

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                        {selectedShow ? selectedShow.title : "Seleziona serie..."}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <div className="relative w-full items-center">
                        <span className="absolute inset-y-0 start-0 flex items-center justify-center px-3">
                            <Search className="size-4 text-muted-foreground" />
                        </span>
                        <Input onChange={handleQueryInput} value={query} />
                    </div>
                    <ul className="p-1 text-sm">
                        {shows.map((show) => (
                            <li key={show.id} className="flex px-2 py-1 hover:bg-light-gray">
                                <a href="#" onClick={(e) => handleClick(e, show)}>
                                    {show.title}
                                </a>
                                <Check className={cn("ml-auto", selectedShow?.id === show.id ? "opacity-100" : "opacity-0")} />
                            </li>
                        ))}
                    </ul>
                </PopoverContent>
            </Popover>
            {selectedShow && seasons && seasons.length > 0 && <SeasonsList show={selectedShow} items={seasons} onSelectSeason={handleSeasonSelect} />}

            {selectedShow && <EpisodesList items={episodes} loading={episodesLoading} />}
        </div>
    );
}

export default App;

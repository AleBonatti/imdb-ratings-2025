import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import api from "./axios";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Tooltip, YAxis, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
//import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

import Header from "./components/Header";
//import SearchBar from "./components/SearchBar";
import SeasonsList from "@/components/SeasonsList";
//import EpisodesList from "./components/EpisodesList";

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
    formatted_title: string;
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
    const [seasonsLoading, setSeasonsLoading] = useState(false);

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
            }, 1000); // debounce di 300ms

            return () => clearTimeout(delayDebounce);
        } else {
            setShows([]);
        }
    }, [query]);

    function handleClick(e: React.MouseEvent<HTMLLIElement>, item: Show): void {
        e.preventDefault();
        setSelectedShow(item);
        setSeasonsLoading(true);

        api.get(`/show/${item.id}/seasons`)
            .then((res) => {
                const results = res.data.items.map((item: any) => ({
                    season: item.season,
                    episodes: item.episodes,
                }));
                setSeasons(results);
                setOpen(false);
            })
            .finally(() => {
                setSeasonsLoading(false);
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
                    formatted_title: item.episode + " " + item.title,
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
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex justify-center px-4">
                <div className="p-6 max-w-6xl w-full space-y-6">
                    {/* Barra di ricerca */}
                    <div>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between transition-all duration-200 hover:shadow-sm">
                                    {selectedShow ? selectedShow.title : "Search show..."}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <div className="relative w-full items-center">
                                    <span className="absolute inset-y-0 start-0 flex items-center justify-center px-3">
                                        <Search className="size-4 text-muted-foreground" />
                                    </span>
                                    <Input onChange={handleQueryInput} value={query} />
                                </div>

                                {shows.length === 0 && !loading && <div className="px-4 pt-4 pb-2 text-center text-sm text-gray-500">Nessun risultato trovato. Prova con un altro termine di ricerca.</div>}

                                <ul className="p-1 text-sm">
                                    {shows.map((show) => (
                                        <li key={show.id} onClick={(e) => handleClick(e, show)} className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{show.title}</span>
                                                <div>
                                                    {show.type}
                                                    {(show.start_year !== null || show.end_year) && (
                                                        <span className="text-xs text-gray-500 pl-1">
                                                            ({show.start_year} - {show.end_year})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Check className={cn("ml-auto", selectedShow?.id === show.id ? "opacity-100" : "opacity-0")} />
                                        </li>
                                    ))}
                                </ul>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Due colonne (Stagioni + Episodi) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="rounded-2xl border p-4 shadow-sm">{selectedShow && seasons.length > 0 && <SeasonsList show={selectedShow} items={seasons} onSelectSeason={handleSeasonSelect} loading={seasonsLoading} />}</div>
                        <div>
                            <EpisodesList items={episodes} loading={episodesLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* Lista Stagioni */
/* function SeasonsList({ show, items, onSelectSeason, loading }: { show: Show; items: Array<Season>; onSelectSeason: (season: Season) => void; loading: boolean }) {
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
                        &nbsp;
                        <Badge variant="secondary">{season.episodes} episodi</Badge>
                    </li>
                ))}
            </ul>
        </div>
    );
} */

/* Lista Episodi */
function EpisodesList({ items, loading }: { items: Array<Episode>; loading: boolean }) {
    if (loading) {
        return (
            <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v4m0 8v4m8-8h-4m-8 0H4" />
                    </svg>
                </motion.div>
                Caricamento episodi...
            </div>
        );
    }

    if (items && items.length === 0) {
        return <div className="mt-4 text-muted-foreground italic">Nessun episodio trovato per questa stagione.</div>;
    }

    const chartConfig = {
        rate: {
            label: "Punteggio",
            color: "hsl(var(--chart-1))",
        },
        label: {
            color: "hsl(var(--background))",
        },
    } satisfies ChartConfig;

    return (
        <div>
            <ChartContainer config={chartConfig} className="mt-4">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={items}
                        layout="vertical"
                        margin={{
                            right: 16,
                        }}>
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border-muted)" />
                        <YAxis dataKey="title" type="category" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} hide />
                        <XAxis dataKey="rate" type="number" axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: "var(--border-muted)" }} content={<ChartTooltipContent indicator="line" />} />
                        <Bar dataKey="rate" fill="var(--primary)" radius={4}>
                            <LabelList dataKey="formatted_title" position="insideLeft" offset={8} className="fill-background" fontSize={12} />
                            <LabelList dataKey="rate" position="right" offset={8} className="fill-foreground" fontSize={14} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}

export default App;

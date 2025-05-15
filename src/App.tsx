import { useState, useEffect } from "react";
import api from "./axios";
//import { Badge } from "@/components/ui/badge";

import { Show, Season, Episode } from "@/types";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import SeasonsList from "@/components/SeasonsList";
import EpisodesList from "./components/EpisodesList";

function App() {
    // ricerca
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    // singolo Show
    const [shows, setShows] = useState<Show[]>([]);
    const [showsLoading, setShowsLoading] = useState(false);
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);
    // stagioni
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [seasonsLoading, setSeasonsLoading] = useState(false);
    // episodi
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [episodesLoading, setEpisodesLoading] = useState(false);

    function handleQueryInput(event: React.ChangeEvent<HTMLInputElement>): void {
        setQuery(event.target.value);
    }

    useEffect(() => {
        if (query) {
            setShowsLoading(true);
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
                        setShowsLoading(false);
                    });
            }, 1000); // debounce di 300ms

            return () => clearTimeout(delayDebounce);
        } else {
            setShows([]);
        }
    }, [query]);

    function handleShowClick(e: React.MouseEvent<HTMLLIElement>, item: Show): void {
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

        console.log(season);

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
                    <SearchBar query={query} onQueryChange={handleQueryInput} open={open} setOpen={setOpen} shows={shows} selectedShow={selectedShow} onSelectShow={handleShowClick} loading={showsLoading} />
                    {/* Due colonne (Stagioni + Episodi) */}
                    {selectedShow && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="rounded-2xl border p-4 shadow-sm">
                                {seasons.length > 0 && (
                                    <div>
                                        <h2 className="text-lg">
                                            <span className="font-semibold">{selectedShow.title}</span>
                                            {selectedShow.title !== selectedShow.original_title && <span>(orig. {selectedShow.original_title})</span>}
                                        </h2>
                                        <h3 className="text-base">
                                            {selectedShow.type} [{selectedShow.start_year} - {selectedShow.end_year}]
                                        </h3>
                                        <SeasonsList seasons={seasons} onSelectSeason={handleSeasonSelect} loading={seasonsLoading} />
                                    </div>
                                )}
                            </div>
                            <div>
                                {/* <h2 className="text-base">epi</h2> */}
                                <EpisodesList items={episodes} loading={episodesLoading} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;

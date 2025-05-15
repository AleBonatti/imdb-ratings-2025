import { useState, useEffect } from "react";

import { Show, Season, Episode } from "@/types";
import { fetchSeasons, fetchShows, fetchRating } from "@/services/api";

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

    function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setQuery(event.target.value);
    }

    useEffect(() => {
        if (query) {
            setShowsLoading(true);

            const delayDebounce = setTimeout(() => {
                fetchShows(query)
                    .then(setShows)
                    .catch((err) => {
                        console.error(err);
                        setShows([]);
                    })
                    .finally(() => setShowsLoading(false));
            }, 700); // debounce di 300ms

            return () => clearTimeout(delayDebounce);
        } else {
            setShows([]);
        }
    }, [query]);

    function handleShowSelect(e: React.MouseEvent<HTMLLIElement>, item: Show): void {
        e.preventDefault();

        setSelectedShow(item);
        setSeasons([]);
        setSeasonsLoading(true);

        fetchSeasons(item.id)
            .then((res) => {
                setSeasons(res);
                setOpen(false);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setSeasonsLoading(false));
    }

    function handleSeasonClick(season: Season) {
        if (!selectedShow) return;

        setEpisodes([]);
        setEpisodesLoading(true);

        fetchRating(selectedShow.id, season.season)
            .then(setEpisodes)
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setEpisodesLoading(false));
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex justify-center px-4">
                <div className="p-6 max-w-6xl w-full space-y-6">
                    <SearchBar query={query} onSearchInput={handleSearchInputChange} open={open} setOpen={setOpen} shows={shows} selectedShow={selectedShow} onShowSelect={handleShowSelect} loading={showsLoading} />
                    {/* Due colonne (Stagioni + Episodi) */}
                    {selectedShow && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="rounded-2xl border p-4 shadow-sm">
                                <div>
                                    <h2 className="text-lg">
                                        <span className="font-semibold">{selectedShow.title}</span>
                                        {selectedShow.title !== selectedShow.original_title && <span>(orig. {selectedShow.original_title})</span>}
                                    </h2>
                                    <h3 className="text-base">
                                        {selectedShow.type} [{selectedShow.start_year} - {selectedShow.end_year}]
                                    </h3>
                                    <SeasonsList seasons={seasons} onSeasonClick={handleSeasonClick} loading={seasonsLoading} />
                                </div>
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

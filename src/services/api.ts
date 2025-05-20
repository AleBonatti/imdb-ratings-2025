import api from "@/axios";
import { Show, Season, Episode } from "@/types";

export async function fetchShows(query: string): Promise<Show[]> {
    const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return res.data.items.map(
        (item: any): Show => ({
            id: item.id,
            type: item.type,
            title: item.title,
            original_title: item.original_title,
            start_year: item.start_year,
            end_year: item.end_year,
            genres: item.genres,
        })
    );
}

export async function fetchSeasons(showId: string): Promise<Season[]> {
    const res = await api.get(`/show/${showId}/seasons`);

    return res.data.items.map(
        (item: any): Season => ({
            season: item.season,
            episodes: item.episodes,
        })
    );
}

export async function fetchRating(showId: string, seasonNumber: string): Promise<Episode[]> {
    const res = await api.get(`/ratings/${showId}?season=${seasonNumber}`);

    return res.data.items.map((item: any) => ({
        num: item.episode,
        title: item.title,
        rate: item.rate,
        votes: item.votes,
        formatted_title: item.episode + " " + item.title,
    }));
}

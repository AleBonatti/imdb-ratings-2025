import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Tooltip, YAxis, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
//import { motion } from "motion/react";
import { Episode, Season } from "@/types";
import { Loader2 } from "lucide-react";

interface EpisodesProps {
    items: Array<Episode>;
    season: Season | null;
    loading: boolean;
}

export default function EpisodesList({ items, season, loading }: EpisodesProps) {
    if (loading) {
        return (
            <div className="flex items-center gap-2 mt-4 text-muted-foreground justify-center text-sm">
                {/* <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v4m0 8v4m8-8h-4m-8 0H4" />
                    </svg>
                </motion.div> */}
                <Loader2 className="ml-2 size-4 animate-spin text-muted-foreground" />
                Caricamento episodi...
            </div>
        );
    }

    if (season !== null && items && items.length === 0) {
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
            {season && <h2>Stagione {season.season}</h2>}
            <ChartContainer config={chartConfig} className="mt-4 h-[450px] w-full">
                <ResponsiveContainer>
                    <BarChart
                        data={items}
                        layout="vertical"
                        barCategoryGap={2}
                        margin={{
                            right: 50,
                        }}>
                        <CartesianGrid horizontal={true} strokeDasharray="3 3" stroke="var(--color-secondary)" />
                        <YAxis dataKey="title" type="category" tickLine={true} tickMargin={10} axisLine={false} hide />
                        <XAxis dataKey="rate" type="number" axisLine={false} domain={[0, 10]} tickLine={false} />
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

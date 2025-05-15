import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Tooltip, YAxis, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { motion } from "motion/react";
import { Episode } from "@/types";

interface EpisodesProps {
    items: Array<Episode>;
    loading: boolean;
}

export default function EpisodesList({ items, loading }: EpisodesProps) {
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

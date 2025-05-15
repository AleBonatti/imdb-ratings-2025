import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Show } from "@/types";

interface SearchBarProps {
    query: string;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    shows: Show[];
    selectedShow: Show | null;
    onShowSelect: (event: React.MouseEvent<HTMLLIElement>, item: Show) => void;
    loading: boolean;
}

export default function SearchBar({ query, onSearchInput, open, setOpen, shows, selectedShow, onShowSelect, loading }: SearchBarProps) {
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full max-w-[500px] justify-between transition-all duration-200 hover:shadow-sm">
                    {selectedShow ? selectedShow.title : "Cerca una serie..."}
                    {loading ? <Loader2 className="ml-2 size-4 animate-spin text-muted-foreground" /> : <ChevronsUpDown className="opacity-50" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <div className="relative w-full items-center">
                    <span className="absolute inset-y-0 start-0 flex items-center justify-center px-3">
                        <Search className="size-4 text-muted-foreground" />
                    </span>
                    {query && (
                        <button type="button" onClick={() => onSearchInput({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)} className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-foreground">
                            <X className="size-4" />
                        </button>
                    )}
                    <Input onChange={onSearchInput} value={query} className="pl-8" />
                </div>

                {shows.length === 0 && !loading && <div className="px-4 pt-4 pb-2 text-center text-sm text-gray-500">Nessun risultato trovato. Prova con un altro termine di ricerca.</div>}

                <ul className="p-1 text-sm">
                    {shows.map((show) => (
                        <li key={show.id} onClick={(e) => onShowSelect(e, show)} className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
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
    );
}

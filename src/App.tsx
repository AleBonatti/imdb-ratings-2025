import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import api from "./axios";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";

interface Show {
    id: string;
    label: string;
}

function App() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [shows, setShows] = useState<Show[]>([]);

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
                            label: item.title,
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

    function handleClick(e: React.MouseEvent<HTMLAnchorElement>, value: string): void {
        e.preventDefault();
        setValue(value);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {value ? shows.find((show) => show.id === value)?.label : "Seleziona serie..."}
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
                            <a href="#" onClick={(e) => handleClick(e, show.id)}>
                                {show.label}
                            </a>
                            <Check className={cn("ml-auto", value === show.id ? "opacity-100" : "opacity-0")} />
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    );
}

export default App;

/* import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import api from "./axios";

interface Show {
    id: string;
    label: string;
}

function App() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [input, setInput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shows, setShows] = useState<Show[]>([]);

    useEffect(() => {
        if (input) {
            setLoading(true);
            const delayDebounce = setTimeout(() => {
                api.get(`/search?q=${encodeURIComponent(input)}`)
                    .then((res) => {
                        const results = res.data.items.map((item: any) => ({
                            id: item.id,
                            label: item.title,
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
    }, [input]);

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                        {value ? shows.find((show) => show.id === value)?.label : "Seleziona serie..."}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Ricerca SerieTv..." className="h-9" onValueChange={setInput} />
                        <CommandList>
                            {loading ? (
                                <div className="flex items-center justify-center p-4 text-muted-foreground text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Caricamento...
                                </div>
                            ) : shows.length === 0 && input ? (
                                <CommandEmpty>Nessun episodio trovato.</CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {shows.map((show) => (
                                        <CommandItem
                                            key={show.id}
                                            value={show.id}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue);
                                                setOpen(false);
                                            }}>
                                            {show.label}
                                            <Check className={cn("ml-auto", value === show.id ? "opacity-100" : "opacity-0")} />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default App;
 */

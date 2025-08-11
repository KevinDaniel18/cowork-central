import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Input } from "@/components/ui/input";

type Filters = {
  q: string;
  type: string;
  minCapacity: string;
  activeOnly: boolean;
};

type SearchBarProps = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
};

export default function SearchBar({ filters, setFilters }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.q);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setFilters((f) => ({ ...f, q: searchTerm }));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, setFilters]);

  return (
    <Input
      id="q"
      placeholder="Search by name or description..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-3"
    />
  );
}

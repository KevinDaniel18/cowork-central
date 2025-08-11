import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export default function SearchBar({ filters, setFilters }: any) {
  const [searchTerm, setSearchTerm] = useState(filters.q);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setFilters((f: any) => ({ ...f, q: searchTerm }));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, setFilters]);

  return (
    <Input
      id="q"
      placeholder="Buscar por nombre o descripción..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-3"
    />
  );
}

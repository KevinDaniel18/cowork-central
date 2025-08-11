"use client";

import SearchBar from "@/components/spaces/search-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { colors } from "@/constants/colors";
import axios from "axios";
import {
  Badge,
  BadgePercent,
  Building2,
  DollarSign,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

type Space = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  priceHour: number;
  amenities: string[];
  imageUrl?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  totalBookings: number;
};

type Filters = {
  q: string;
  type: string;
  minCapacity: string;
  activeOnly: boolean;
};

const defaultFilters: Filters = {
  q: "",
  type: "ALL",
  minCapacity: "",
  activeOnly: true,
};

const typeOptions = [
  { value: "ALL", label: "Todos los escritorios" },
  { value: "DESK", label: "Escritorio" },
  { value: "OFFICE", label: "Oficina Privada" },
  { value: "MEETING_ROOM", label: "Sala de reuniones" },
  { value: "PHONE_BOOTH", label: "Phone Booth" },
];

export default function SpacesPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "DESK",
    capacity: "1",
    priceHour: "10",
    amenities: "",
    imageUrl: "",
    description: "",
  });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.type !== "ALL") params.set("type", filters.type);
    if (filters.minCapacity) params.set("minCapacity", filters.minCapacity);
    if (filters.activeOnly) params.set("active", "true");
    return params.toString();
  }, [filters]);

  async function fetchSpaces(signal?: AbortSignal) {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/spaces${query ? `?${query}` : ""}`, {
        signal,
      });
      const data = res.data;
      if (!data?.success) throw new Error("Error al cargar espacios");
      setSpaces(data.spaces);
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") return;
      setError("No pudimos cargar los espacios");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const ctrl = new AbortController();
    fetchSpaces(ctrl.signal);
    return () => ctrl.abort();
  }, [query]);

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSelectChange(value: string) {
    setForm((prev) => ({ ...prev, type: value }));
  }

  async function onCreateSpace(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        capacity: Number(form.capacity),
        priceHour: Number(form.priceHour),
        amenities: form.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        imageUrl: form.imageUrl.trim() || undefined,
        description: form.description.trim() || undefined,
      };

      console.log("payload", payload);

      const res = await axios.post("/api/spaces", payload, {
        headers: {
          "Content-Type": "application/json",
          ...(adminMode ? { "x-admin": "true" } : {}),
        },
      });

      const data = res.data;
      if (!data.success) throw new Error("No se pudo crear el espacio");
      setCreateOpen(false);
      setForm({
        name: "",
        type: "DESK",
        capacity: "1",
        priceHour: "10",
        amenities: "",
        imageUrl: "",
        description: "",
      });
      fetchSpaces();
    } catch (error: any) {
      setError(error?.response?.data?.error ?? "No se pudo crear el espacio");
    } finally {
      setCreating(false);
    }
  }
  return (
    <main className="min-h-[100svh]">
      <section
        className="border-b"
        style={{
          backgroundImage: colors.gradients.hero,
          borderColor: colors.border.light,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: colors.foreground.light }}
              >
                Catálogo de Espacios
              </h1>
              <p className="text-sm" style={{ color: colors.neutral[600] }}>
                Explora escritorios, salas y oficinas privadas. Filtra por tipo
                y capacidad
              </p>
            </div>

            <div className="flex items-center gap-4">
              <label
                className="inline-flex items-center gap-2 text-sm"
                style={{ color: colors.neutral[600] }}
              >
                <input
                  type="checkbox"
                  checked={adminMode}
                  onChange={(e) => setAdminMode(e.target.checked)}
                  className="h-4 w-4 rounded border"
                  style={{ borderColor: colors.border.light }}
                />
                Admin Mode
              </label>

              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="text-white"
                    style={{ backgroundColor: colors.brand.primary[600] }}
                    disabled={!adminMode}
                    title={
                      !adminMode
                        ? "Activa Admin Mode para crear"
                        : "Crear nuevo espacio"
                    }
                  >
                    <Plus className="w-4 h-5" /> Nuevo espacio
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear espacio</DialogTitle>
                    <DialogDescription>
                      Completa los campos requeridos para crear un espacio
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={onCreateSpace} className="grid gap-4">
                    <div className="grid gap-2">
                      <Label className="grid gap-2">Nombre</Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleInput}
                        placeholder="Sala Norte A"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Tipo</Label>
                      <Select
                        value={form.type}
                        name="type"
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {typeOptions
                            .filter(({ value }) => value !== "ALL")
                            .map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="capacity">Capacidad</Label>
                        <Input
                          id="capacity"
                          name="capacity"
                          type="number"
                          min={1}
                          value={form.capacity}
                          onChange={handleInput}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="priceHour">Precio por hora (USD)</Label>
                        <Input
                          id="priceHour"
                          name="priceHour"
                          type="number"
                          min={0}
                          step="0.01"
                          value={form.priceHour}
                          onChange={handleInput}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="amenities">
                        Amenities (separados por coma)
                      </Label>
                      <Input
                        id="amenities"
                        name="amenities"
                        value={form.amenities}
                        onChange={handleInput}
                        placeholder="Wifi, Pantalla, Pizarra, Café"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="imageUrl">Imagen (URL)</Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleInput}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Input
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleInput}
                        placeholder="Breve descripción del espacio y recomendaciones de uso."
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={creating}
                        className="text-white"
                        style={{ backgroundColor: colors.brand.primary[600] }}
                      >
                        {creating ? "Creando..." : "Crear espacio"}
                      </Button>
                    </div>

                    {!adminMode && (
                      <p
                        className="text-xs"
                        style={{ color: colors.neutral[600] }}
                      >
                        Para crear debes activar Admin mode (envía un header
                        x-admin en el POST)
                      </p>
                    )}
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="q" className="sr-only">
                Buscar
              </Label>
              <SearchBar filters={filters} setFilters={setFilters} />
            </div>

            <div>
              <Label className="sr-only">Tipo</Label>
              <Select
                value={filters.type}
                onValueChange={(v) => setFilters((f) => ({ ...f, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                placeholder="Capacidad mínima"
                value={filters.minCapacity}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, minCapacity: e.target.value }))
                }
              />
              <label
                className="inline-flex items-center gap-2 px-3 rounded-md border"
                style={{ borderColor: colors.border.light }}
              >
                <input
                  type="checkbox"
                  checked={filters.activeOnly}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, activeOnly: e.target.checked }))
                  }
                />
                <span
                  className="text-sm"
                  style={{ color: colors.neutral[700] }}
                >
                  Activos
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div
              className="mb-6 rounded-md border px-4 py-3 text-sm"
              style={{
                borderColor: "#fecaca",
                backgroundColor: "#fee2e2",
                color: "#7f1d1d",
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-40 w-full rounded-t-md" />
                  <CardHeader>
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : spaces.length === 0 ? (
            <div className="text-center py-16">
              <Building2
                className="w-full h-10 mx-auto mb-3"
                style={{ color: colors.neutral[400] }}
              />
              <p className="text-sm" style={{ color: colors.neutral[600] }}>
                No encontramos espacios con esos filtros
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map(
                ({
                  id,
                  imageUrl,
                  name,
                  isActive,
                  type,
                  capacity,
                  priceHour,
                  totalBookings,
                  description,
                  amenities,
                }) => (
                  <Card key={id} className="overflow-hidden p-0">
                    <div className="relative h-50 w-full">
                      <Image
                        src={
                          imageUrl ||
                          `/coworking-flex-desks.png?height=300&width=600&query=espacio de coworking moderno con escritorios`
                        }
                        alt={`Imagen de ${name}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {!isActive && (
                        <div className="absolute left-3 top-3">
                          <Badge
                            fontVariant="secondary"
                            className="bg-neutral-900/80 text-white"
                          >
                            Inactivo
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-lg">{name}</CardTitle>
                        <Badge
                          style={{
                            backgroundColor: colors.brand.primary[50],
                            color: colors.brand.primary[700],
                          }}
                          className="font-normal"
                        >
                          {typeOptions.find((t) => t.value === type)?.label ||
                            type}
                        </Badge>
                      </div>
                      <div
                        className="flex flex-wrap items-center gap-3 text-sm"
                        style={{ color: colors.neutral[600] }}
                      >
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-4 h-4" /> {capacity} personas
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />{" "}
                          {priceHour.toFixed(2)}/h
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <BadgePercent className="w-4 h-4" /> {totalBookings}{" "}
                          reservas
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p
                        className="text-sm"
                        style={{ color: colors.neutral[700] }}
                      >
                        {description ||
                          "Espacio disponible para tus necesidades de coworking."}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {amenities.slice(0, 5).map((a, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: colors.neutral[100],
                              color: colors.neutral[700],
                            }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center mb-4">
                      {isActive ? (
                        <a
                          href={`/booking?space=${id}`}
                          className="text-sm font-medium"
                          style={{ color: colors.brand.secondary[700] }}
                        >
                          Reservar ahora
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-neutral-500">
                          No disponible
                        </span>
                      )}

                      <span
                        className="inline-flex items-center gap-1 text-sm"
                        style={{ color: colors.neutral[600] }}
                      >
                        <MapPin className="w-4 h-4" />
                        {isActive ? "Disponible" : "No disponible"}
                      </span>
                    </CardFooter>
                  </Card>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

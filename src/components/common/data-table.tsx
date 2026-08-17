import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Rows2,
  Rows3,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { EmptyState, TableSkeleton } from "./states";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  value?: (row: T) => string | number;
  className?: string;
  align?: "left" | "right";
  sortable?: boolean;
  hideBelow?: "md" | "lg";
}

export interface FacetFilter<T> {
  key: string;
  label: string;
  options: string[];
  match: (row: T, v: string) => boolean;
}

function renderCell<T>(c: Column<T> | undefined, row: T): ReactNode {
  if (!c) return null;
  return c.render ? c.render(row) : String(c.value?.(row) ?? "");
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchKeys,
  filters = [],
  onRowClick,
  bulkActions,
  loading = false,
  pageSize: initialPageSize = 12,
  cardTitle,
  emptyTitle,
  toolbarExtra,
}: {
  rows: T[];
  columns: Column<T>[];
  searchKeys?: (row: T) => string;
  filters?: FacetFilter<T>[];
  onRowClick?: (row: T) => void;
  bulkActions?: ReactNode;
  loading?: boolean;
  pageSize?: number;
  cardTitle?: (row: T) => ReactNode;
  emptyTitle?: string;
  toolbarExtra?: ReactNode;
}) {
  const [q, setQ] = useState("");
  const [facets, setFacets] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const pageSize = initialPageSize;

  const filtered = useMemo(() => {
    let out = rows;
    if (q && searchKeys) {
      const needle = q.toLowerCase();
      out = out.filter((r) => searchKeys(r).toLowerCase().includes(needle));
    }
    for (const f of filters) {
      const v = facets[f.key];
      if (v && v !== "all") out = out.filter((r) => f.match(r, v));
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.value) {
        out = [...out].sort((a, b) => {
          const av = col.value!(a);
          const bv = col.value!(b);
          const cmp = typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv));
          return sort.dir === "asc" ? cmp : -cmp;
        });
      }
    }
    return out;
  }, [rows, q, facets, filters, sort, columns, searchKeys]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(current * pageSize, current * pageSize + pageSize);
  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex flex-col gap-2 border-b border-border p-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Search records…"
            className="h-8 pl-8 text-xs"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <Select
              key={f.key}
              value={facets[f.key] ?? "all"}
              onValueChange={(v) => {
                setFacets((s) => ({ ...s, [f.key]: v }));
                setPage(0);
              }}
            >
              <SelectTrigger className="h-8 min-w-[8rem] text-xs">
                <SlidersHorizontal className="size-3" />
                <SelectValue placeholder={f.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All {f.label.toLowerCase()}
                </SelectItem>
                {f.options.map((o) => (
                  <SelectItem key={o} value={o} className="text-xs capitalize">
                    {o.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          {toolbarExtra}
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={() => setDense((d) => !d)}
            aria-label="Toggle density"
          >
            {dense ? <Rows3 className="size-3.5" /> : <Rows2 className="size-3.5" />}
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Download className="size-3.5" /> Export
          </Button>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-3 border-b border-border bg-accent/40 px-3 py-2 text-xs">
          <span className="font-medium">{selectedCount} selected</span>
          <div className="flex flex-wrap gap-2">{bulkActions}</div>
          <button
            className="ml-auto text-muted-foreground hover:text-foreground"
            onClick={() => setSelected({})}
          >
            Clear
          </button>
        </div>
      )}

      {loading ? (
        <TableSkeleton cols={columns.length} />
      ) : pageRows.length === 0 ? (
        <EmptyState title={emptyTitle ?? "No matching records"} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2/60 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {bulkActions && (
                    <th className="w-9 px-3 py-2">
                      <Checkbox
                        checked={pageRows.every((r) => selected[r.id])}
                        onCheckedChange={(v) => {
                          const next = { ...selected };
                          pageRows.forEach((r) => (next[r.id] = Boolean(v)));
                          setSelected(next);
                        }}
                      />
                    </th>
                  )}
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className={cn(
                        "px-3 py-2 text-left font-medium",
                        c.align === "right" && "text-right",
                        c.hideBelow === "lg" && "hidden lg:table-cell",
                        c.hideBelow === "md" && "hidden md:table-cell",
                      )}
                    >
                      {c.value ? (
                        <button
                          className="inline-flex items-center gap-1 hover:text-foreground"
                          onClick={() =>
                            setSort((s) =>
                              s?.key === c.key
                                ? { key: c.key, dir: s.dir === "asc" ? "desc" : "asc" }
                                : { key: c.key, dir: "asc" },
                            )
                          }
                        >
                          {c.header}
                          {sort?.key === c.key &&
                            (sort.dir === "asc" ? (
                              <ArrowUp className="size-3" />
                            ) : (
                              <ArrowDown className="size-3" />
                            ))}
                        </button>
                      ) : (
                        c.header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b border-border/70 last:border-0 hover:bg-accent/40",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {bulkActions && (
                      <td className="px-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={Boolean(selected[row.id])}
                          onCheckedChange={(v) =>
                            setSelected((s) => ({ ...s, [row.id]: Boolean(v) }))
                          }
                        />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={cn(
                          "px-3 align-middle",
                          dense ? "py-1.5" : "py-3",
                          c.align === "right" && "text-right",
                          c.hideBelow === "lg" && "hidden lg:table-cell",
                          c.hideBelow === "md" && "hidden md:table-cell",
                          c.className,
                        )}
                      >
                        {c.render ? c.render(row) : String(c.value?.(row) ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-border md:hidden">
            {pageRows.map((row) => (
              <li
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className="space-y-2 px-3 py-3 active:bg-accent/40"
              >
                <div className="text-sm font-medium">
                  {cardTitle ? cardTitle(row) : renderCell(columns[0], row)}
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                  {columns.slice(1, 5).map((c) => (
                    <div key={c.key} className="min-w-0">
                      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {c.header}
                      </dt>
                      <dd className="truncate">
                        {c.render ? c.render(row) : String(c.value?.(row) ?? "")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2 text-xs text-muted-foreground">
        <span>
          {filtered.length} record{filtered.length === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-2">
          <span>
            Page {current + 1} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="size-7 p-0"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="size-7 p-0"
            disabled={current >= pageCount - 1}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

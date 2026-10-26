"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import ProductImage from "@/components/product/ProductImage";
import { CHAMPAGNE_LOCATIONS } from "@/lib/data/champagneLocations";
import { getChampagneBySlug } from "@/lib/data/champagnes";
import type { Champagne } from "@/types/champagne";

/**
 * Calibration de la carte France (viewBox "15 -1 598 586") à partir des
 * centroïdes de l'Île-de-France et de la Corse, projetés en équirectangulaire.
 */
const MAP_VIEWBOX = { minX: 15, minY: -1, width: 598, height: 586 };
const X_SCALE = 40.857;
const X_OFFSET = 223.09;
const Y_SCALE = -57.24;
const Y_OFFSET = 2950.6;

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const FOCUS_ZOOM = 5;
const PIN_GAP = 46;
const PIN_PADDING = 26;
const TOOLTIP_WIDTH = 264;
const TOOLTIP_HEIGHT = 250;

type Terroir = {
  id: string;
  village: string;
  area: string;
  description: string;
  xPct: number;
  yPct: number;
  champagnes: Champagne[];
};

const TERROIRS: Terroir[] = CHAMPAGNE_LOCATIONS.map((location) => {
  const x = X_OFFSET + X_SCALE * location.lng;
  const y = Y_OFFSET + Y_SCALE * location.lat;

  return {
    id: location.id,
    village: location.village,
    area: location.area,
    description: location.description,
    xPct: ((x - MAP_VIEWBOX.minX) / MAP_VIEWBOX.width) * 100,
    yPct: ((y - MAP_VIEWBOX.minY) / MAP_VIEWBOX.height) * 100,
    champagnes: location.champagneSlugs
      .map((slug) => getChampagneBySlug(slug))
      .filter((champagne): champagne is Champagne => champagne !== undefined),
  };
});

const TOTAL_CUVEES = TERROIRS.reduce(
  (total, terroir) => total + terroir.champagnes.length,
  0
);

const CENTROID = TERROIRS.reduce(
  (center, terroir) => ({
    xPct: center.xPct + terroir.xPct / TERROIRS.length,
    yPct: center.yPct + terroir.yPct / TERROIRS.length,
  }),
  { xPct: 0, yPct: 0 }
);

type View = { zoom: number; x: number; y: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function ChampagneTerroirsMap() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const movedRef = useRef(false);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [view, setView] = useState<View>({ zoom: 1, x: 0, y: 0 });
  const [smooth, setSmooth] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setSize({ width: element.clientWidth, height: element.clientHeight });
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const clampView = useCallback(
    (candidate: View): View => {
      const { width, height } = size;

      return {
        zoom: candidate.zoom,
        x: clamp(candidate.x, width * (1 - candidate.zoom), 0),
        y: clamp(candidate.y, height * (1 - candidate.zoom), 0),
      };
    },
    [size]
  );

  const zoomBy = useCallback(
    (factor: number, focusX: number, focusY: number) => {
      setView((current) => {
        const zoom = clamp(current.zoom * factor, MIN_ZOOM, MAX_ZOOM);

        return clampView({
          zoom,
          x: focusX - (focusX - current.x) * (zoom / current.zoom),
          y: focusY - (focusY - current.y) * (zoom / current.zoom),
        });
      });
    },
    [clampView]
  );

  const resetView = useCallback(() => {
    setSmooth(true);
    setView({ zoom: 1, x: 0, y: 0 });
  }, []);

  const focusChampagne = useCallback(() => {
    setSmooth(true);
    setView(
      clampView({
        zoom: FOCUS_ZOOM,
        x: size.width / 2 - (CENTROID.xPct / 100) * size.width * FOCUS_ZOOM,
        y: size.height / 2 - (CENTROID.yPct / 100) * size.height * FOCUS_ZOOM,
      })
    );
  }, [clampView, size.height, size.width]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      setSmooth(false);
      zoomBy(
        clamp(Math.exp(-event.deltaY * 0.0016), 0.8, 1.25),
        event.clientX - rect.left,
        event.clientY - rect.top
      );
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [zoomBy]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const element = viewportRef.current;
    if (!element) return;

    movedRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: viewRef.current.x,
      originY: viewRef.current.y,
      moved: false,
    };
    element.setPointerCapture(event.pointerId);
    setSmooth(false);
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (!drag.moved && Math.hypot(dx, dy) > 4) {
      drag.moved = true;
      movedRef.current = true;
    }
    if (!drag.moved) return;

    setView((current) =>
      clampView({ zoom: current.zoom, x: drag.originX + dx, y: drag.originY + dy })
    );
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setDragging(false);

    if (viewportRef.current?.hasPointerCapture(event.pointerId)) {
      viewportRef.current.releasePointerCapture(event.pointerId);
    }

    const clickedOnPin = (event.target as HTMLElement).closest("[data-map-pin]");
    if (!drag.moved && !clickedOnPin) setSelectedId(null);
  };

  const handleDoubleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSmooth(true);
    zoomBy(1.8, event.clientX - rect.left, event.clientY - rect.top);
  };

  const pins = useMemo(() => {
    if (!size.width || !size.height) return [];

    const anchors = TERROIRS.map((terroir) => ({
      terroir,
      baseX: (terroir.xPct / 100) * size.width * view.zoom + view.x,
      baseY: (terroir.yPct / 100) * size.height * view.zoom + view.y,
    }));

    // Les villages champenois sont distants de quelques kilomètres : à l'échelle
    // de la France leurs points se superposent. On les écarte légèrement à
    // l'écran (avec une ligne de rappel vers la position réelle) pour rester lisible.
    const points = anchors.map((anchor) => ({ x: anchor.baseX, y: anchor.baseY }));

    for (let iteration = 0; iteration < 60; iteration += 1) {
      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          let dx = points[j].x - points[i].x;
          let dy = points[j].y - points[i].y;
          let distance = Math.hypot(dx, dy);

          if (distance < 0.001) {
            const angle = (i * 7 + j * 11) * 0.7;
            dx = Math.cos(angle);
            dy = Math.sin(angle);
            distance = 1;
          }

          if (distance < PIN_GAP) {
            const push = (PIN_GAP - distance) / 2;
            const ux = dx / distance;
            const uy = dy / distance;
            points[i].x -= ux * push;
            points[i].y -= uy * push;
            points[j].x += ux * push;
            points[j].y += uy * push;
          }
        }
      }
    }

    return anchors.map((anchor, index) => ({
      ...anchor,
      x: clamp(points[index].x, PIN_PADDING, size.width - PIN_PADDING),
      y: clamp(points[index].y, PIN_PADDING, size.height - PIN_PADDING),
    }));
  }, [size, view]);

  const activeId = hoveredId ?? selectedId;
  const activePin = pins.find((pin) => pin.terroir.id === activeId);
  const tooltipVisible =
    activePin &&
    activePin.x > 0 &&
    activePin.y > 0 &&
    activePin.x < size.width &&
    activePin.y < size.height;

  const tooltipLeft = activePin
    ? clamp(
        activePin.x - TOOLTIP_WIDTH / 2,
        8,
        Math.max(8, size.width - TOOLTIP_WIDTH - 8)
      )
    : 0;
  const tooltipTop = activePin
    ? activePin.y + TOOLTIP_HEIGHT + 24 > size.height
      ? clamp(activePin.y - TOOLTIP_HEIGHT - 24, 8, size.height - TOOLTIP_HEIGHT - 8)
      : activePin.y + 24
    : 0;
  const tooltipIsSticky = Boolean(activePin && selectedId === activePin.terroir.id);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Carte de France */}
      <div className="lg:col-span-7">
        <div className="flex items-baseline justify-between border-b border-[#DCD7CD] pb-4">
          <p className="page-label">France · Grand Est</p>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#827D75]">
            {String(TERROIRS.length).padStart(2, "0")} terroirs ·{" "}
            {String(TOTAL_CUVEES).padStart(2, "0")} cuvées
          </span>
        </div>

        <div className="mt-5 border border-[#DCD7CD] bg-[#FCFBF8] p-3 sm:p-5">
          <div
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            className={`relative aspect-[598/586] w-full touch-none select-none overflow-hidden bg-[#F1EEE7] ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {/* Carte zoomable */}
            <div
              className="absolute inset-0 origin-top-left will-change-transform"
              style={{
                transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.zoom})`,
                transition: smooth ? `transform 400ms ${EASE}` : "none",
              }}
            >
              <Image
                src="/france-regions.svg"
                alt="Carte des régions de France avec la Champagne mise en évidence"
                width={598}
                height={586}
                unoptimized
                draggable={false}
                className="absolute inset-0 h-full w-full select-none object-contain"
              />

              {/* Halo de la zone champenoise */}
              <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#A58C62]/50 bg-[#A58C62]/5"
                style={{
                  left: `${CENTROID.xPct}%`,
                  top: `${CENTROID.yPct}%`,
                  width: "12%",
                  aspectRatio: "1 / 1",
                }}
              />
            </div>

            {/* Lignes de rappel et épingles (taille constante, hors zoom) */}
            <svg
              className="pointer-events-none absolute inset-0 z-10 h-full w-full"
              aria-hidden="true"
            >
              {pins.map((pin) => {
                const distance = Math.hypot(pin.x - pin.baseX, pin.y - pin.baseY);
                if (distance < 3) return null;

                return (
                  <g key={pin.terroir.id}>
                    <line
                      x1={pin.baseX}
                      y1={pin.baseY}
                      x2={pin.x}
                      y2={pin.y}
                      stroke="#A58C62"
                      strokeWidth={1}
                      strokeDasharray="2 3"
                      opacity={0.6}
                    />
                    <circle
                      cx={pin.baseX}
                      cy={pin.baseY}
                      r={2.2}
                      fill="#A58C62"
                    />
                  </g>
                );
              })}
            </svg>

            <div className="pointer-events-none absolute left-4 top-4 z-20 hidden items-center gap-2.5 border border-[#DCD7CD] bg-[#FCFBF8]/95 px-3 py-2 backdrop-blur-sm md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A58C62]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#171715]">
                Grand Est
              </span>
              <span className="text-[9px] uppercase tracking-[0.14em] text-[#827D75]">
                {TERROIRS.length} terroirs · {TOTAL_CUVEES} cuvées
              </span>
            </div>

            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={focusChampagne}
              className="absolute left-4 top-4 z-20 inline-flex h-9 items-center gap-2 border border-[#C8C1B4] bg-[#FCFBF8]/95 px-2.5 text-[9px] font-medium uppercase tracking-[0.16em] text-[#171715] backdrop-blur-sm transition-colors hover:border-[#171715] hover:bg-[#171715] hover:text-[#FCFBF8] sm:px-3 sm:tracking-[0.18em] md:left-auto md:right-4"
            >
              <MapPin className="h-3 w-3 text-[#A58C62]" />
              Cadrer la Champagne
            </button>

            <div
              onPointerDown={(event) => event.stopPropagation()}
              className="absolute bottom-4 right-4 z-20 flex flex-col items-stretch border border-[#C8C1B4] bg-[#FCFBF8]/95 backdrop-blur-sm"
            >
              <button
                type="button"
                onClick={() => {
                  setSmooth(true);
                  zoomBy(1.5, size.width / 2, size.height / 2);
                }}
                disabled={view.zoom >= MAX_ZOOM}
                className="flex h-9 w-9 items-center justify-center text-[#171715] transition-colors hover:bg-[#171715] hover:text-[#FCFBF8] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#171715]"
                aria-label="Zoomer sur la carte"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <span className="border-y border-[#DCD7CD] px-1 py-1 text-center font-mono text-[9px] tracking-[0.06em] text-[#827D75]">
                {Math.round(view.zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => {
                  setSmooth(true);
                  zoomBy(1 / 1.5, size.width / 2, size.height / 2);
                }}
                disabled={view.zoom <= MIN_ZOOM}
                className="flex h-9 w-9 items-center justify-center text-[#171715] transition-colors hover:bg-[#171715] hover:text-[#FCFBF8] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#171715]"
                aria-label="Dézoomer la carte"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={resetView}
                className="flex h-9 w-9 items-center justify-center border-t border-[#DCD7CD] text-[#171715] transition-colors hover:bg-[#171715] hover:text-[#FCFBF8]"
                aria-label="Réinitialiser la carte"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="pointer-events-none absolute bottom-4 left-4 z-20 hidden text-[9px] uppercase tracking-[0.16em] text-[#827D75] sm:block">
              Molette pour zoomer · Glisser pour déplacer
            </p>

            {/* Épingles des villages */}
            {pins.map((pin, index) => {
              const isActive = activeId === pin.terroir.id;
              const isSelected = selectedId === pin.terroir.id;
              const champagneNames = pin.terroir.champagnes
                .map((champagne) => champagne.name)
                .join(", ");

              return (
                <button
                  key={pin.terroir.id}
                  type="button"
                  data-map-pin
                  aria-pressed={isSelected}
                  aria-label={`${pin.terroir.village} — ${pin.terroir.area} : ${champagneNames}`}
                  onMouseEnter={() => setHoveredId(pin.terroir.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(pin.terroir.id)}
                  onBlur={() => setHoveredId(null)}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (movedRef.current) return;
                    setSelectedId((current) =>
                      current === pin.terroir.id ? null : pin.terroir.id
                    );
                  }}
                  style={{
                    left: pin.x,
                    top: pin.y,
                    zIndex: isActive ? 24 : 20,
                    transition: smooth
                      ? `left 400ms ${EASE}, top 400ms ${EASE}, background-color 200ms, color 200ms`
                      : "background-color 200ms, color 200ms",
                  }}
                  className={`absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[9px] font-semibold shadow-[0_2px_10px_rgba(23,23,21,0.18)] ${
                    isActive || isSelected
                      ? "border-[#A58C62] bg-[#A58C62] text-[#FCFBF8]"
                      : "border-[#A58C62] bg-[#FCFBF8] text-[#A58C62] hover:bg-[#171715] hover:text-[#FCFBF8]"
                  }`}
                >
                  {isActive && (
                    <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full border border-[#A58C62]/70" />
                  )}
                  {index + 1}
                </button>
              );
            })}

            {/* Fiche du terroir survolé / sélectionné */}
            {tooltipVisible && activePin && (
              <div
                onPointerDown={(event) => event.stopPropagation()}
                style={{
                  left: tooltipLeft,
                  top: tooltipTop,
                  width: TOOLTIP_WIDTH,
                  transition: smooth
                    ? `left 400ms ${EASE}, top 400ms ${EASE}`
                    : "none",
                }}
                className={`absolute z-30 border border-[#C8C1B4] bg-[#FCFBF8] p-4 shadow-[0_20px_45px_rgba(23,23,21,0.16)] ${
                  tooltipIsSticky ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#A58C62]">
                  {activePin.terroir.area}
                </p>
                <h4 className="mt-1 font-serif text-xl font-normal leading-tight">
                  {activePin.terroir.village}
                </h4>

                <ul className="mt-3 space-y-2.5 border-t border-[#DCD7CD] pt-3">
                  {activePin.terroir.champagnes.map((champagne) => (
                    <li key={champagne.id}>
                      <Link
                        href={`/champagnes/${champagne.slug}`}
                        className="group/link flex items-center gap-3"
                      >
                        <span className="relative block h-12 w-9 flex-shrink-0 overflow-hidden border border-[#DCD7CD] bg-[#F1EEE7]">
                          <ProductImage
                            src={champagne.imageUrl}
                            alt={`${champagne.house} ${champagne.name}`}
                            house={champagne.house}
                            name={champagne.name}
                            sizes="36px"
                            className="object-contain"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[8px] font-medium uppercase tracking-[0.18em] text-[#827D75]">
                            {champagne.house}
                          </span>
                          <span className="mt-0.5 block truncate text-[12px] leading-snug text-[#171715]">
                            {champagne.name}
                          </span>
                          <span className="mt-0.5 block text-[10px] tracking-[0.04em] text-[#A58C62]">
                            {champagne.price} €
                          </span>
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0 text-[#827D75] opacity-0 transition-opacity group-hover/link:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-[9px] leading-relaxed text-[#827D75]">
                  {tooltipIsSticky
                    ? "Cliquez sur une cuvée pour ouvrir sa fiche."
                    : "Cliquez sur l'épingle pour garder cette fiche ouverte."}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[9px] uppercase tracking-[0.16em] text-[#827D75]">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 border border-[#A58C62] bg-[#EDE6D6]" />
            Grand Est
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#A58C62]" />
            Terroirs de nos cuvées
          </span>
          <span className="ml-auto normal-case tracking-normal">
            Épingles légèrement écartées pour la lisibilité.
          </span>
        </div>
      </div>

      {/* Détail des terroirs */}
      <div className="lg:col-span-5">
        <div className="flex items-baseline justify-between border-b border-[#DCD7CD] pb-4">
          <h2 className="font-serif text-2xl font-light">Nos terroirs</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#827D75]">
            {String(TERROIRS.length).padStart(2, "0")} villages
          </span>
        </div>

        <ol className="mt-5 space-y-3">
          {TERROIRS.map((terroir, index) => {
            const isActive = activeId === terroir.id;

            return (
              <li key={terroir.id}>
                <div
                  onMouseEnter={() => setHoveredId(terroir.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(terroir.id)}
                  onBlur={() => setHoveredId(null)}
                  className={`border p-4 transition-colors duration-300 sm:p-5 ${
                    isActive
                      ? "border-[#A58C62] bg-[#FBF7EF]"
                      : "border-[#DCD7CD] bg-[#FCFBF8]"
                  }`}
                >
                  <div className="flex gap-3.5">
                    <span
                      className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center border transition-colors ${
                        isActive
                          ? "border-[#A58C62] bg-[#A58C62] text-[#FCFBF8]"
                          : "border-[#C8C1B4] text-[#A58C62]"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-serif text-xl font-normal leading-tight text-[#171715]">
                          {terroir.village}
                        </h3>
                        <span className="flex-shrink-0 font-mono text-[10px] text-[#B3ACA1]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#A58C62]">
                        {terroir.area}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-[#827D75]">
                        {terroir.description}
                      </p>

                      <ul className="mt-3 space-y-1.5 border-t border-[#E7E2D8] pt-2.5">
                        {terroir.champagnes.map((champagne) => (
                          <li key={champagne.id}>
                            <Link
                              href={`/champagnes/${champagne.slug}`}
                              className="group/link flex items-baseline justify-between gap-3 text-[11px] leading-relaxed text-[#171715] transition-colors hover:text-[#A58C62]"
                            >
                              <span className="min-w-0">
                                <span className="text-[#827D75]">
                                  {champagne.house}
                                </span>{" "}
                                · {champagne.name}
                              </span>
                              <span className="flex flex-shrink-0 items-center gap-1.5 text-[10px] tracking-[0.04em] text-[#A58C62]">
                                {champagne.price} €
                                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-5 border-t border-[#DCD7CD] pt-4 text-[10px] leading-relaxed text-[#827D75]">
          Les flacons sont expédiés depuis nos crayères d&apos;Épernay, sous
          température dirigée et avec certificat de provenance.
        </p>
      </div>
    </div>
  );
}

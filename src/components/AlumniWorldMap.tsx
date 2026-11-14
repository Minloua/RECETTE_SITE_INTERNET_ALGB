import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import countriesAtlas from 'world-atlas/countries-110m.json';
import { AlumniMember } from '../data/mockData';
import { useApp } from '../context/AppContext';
import {
  Eye,
  Globe,
  MapPin,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Users,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface AlumniWorldMapProps {
  members: AlumniMember[];
  onViewCard: (member: AlumniMember) => void;
  onContact: (member: AlumniMember) => void;
}

interface CountryMeta {
  isoId: string;
  label: string;
  coords: [number, number]; // [lon, lat]
}

interface CityHub {
  key: string;
  city: string;
  countryLabel: string;
  isoId: string;
  coords: [number, number];
  members: AlumniMember[];
}

interface CountryStats {
  isoId: string;
  label: string;
  count: number;
  mentorsCount: number;
  cities: string[];
  members: AlumniMember[];
}

const BINGERVILLE_COORDS: [number, number] = [-3.89, 5.35];

const COUNTRY_CATALOG: Record<string, CountryMeta> = {
  "cote d'ivoire": { isoId: '384', label: 'Côte d’Ivoire', coords: [-5.5471, 7.54] },
  'ivory coast': { isoId: '384', label: 'Côte d’Ivoire', coords: [-5.5471, 7.54] },
  france: { isoId: '250', label: 'France', coords: [2.2137, 46.2276] },
  senegal: { isoId: '686', label: 'Sénégal', coords: [-14.4524, 14.4974] },
  mali: { isoId: '466', label: 'Mali', coords: [-3.9962, 17.5707] },
  'burkina faso': { isoId: '854', label: 'Burkina Faso', coords: [-1.5616, 12.2383] },
  canada: { isoId: '124', label: 'Canada', coords: [-106.3468, 56.1304] },
  belgique: { isoId: '056', label: 'Belgique', coords: [4.4699, 50.5039] },
  belgium: { isoId: '056', label: 'Belgique', coords: [4.4699, 50.5039] },
  maroc: { isoId: '504', label: 'Maroc', coords: [-7.0926, 31.7917] },
  morocco: { isoId: '504', label: 'Maroc', coords: [-7.0926, 31.7917] },
  'etats-unis': { isoId: '840', label: 'États-Unis', coords: [-95.7129, 37.0902] },
  usa: { isoId: '840', label: 'États-Unis', coords: [-95.7129, 37.0902] },
  'royaume-uni': { isoId: '826', label: 'Royaume-Uni', coords: [-3.436, 55.3781] },
  allemagne: { isoId: '276', label: 'Allemagne', coords: [10.4515, 51.1657] },
  suisse: { isoId: '756', label: 'Suisse', coords: [8.2275, 46.8182] },
  ghana: { isoId: '288', label: 'Ghana', coords: [-1.0232, 7.9465] },
  cameroun: { isoId: '120', label: 'Cameroun', coords: [12.3547, 7.3697] },
  guinee: { isoId: '324', label: 'Guinée', coords: [-9.6966, 9.9456] },
  togo: { isoId: '768', label: 'Togo', coords: [0.8248, 8.6195] },
  benin: { isoId: '204', label: 'Bénin', coords: [2.3158, 9.3077] },
};

const CITY_COORDS: Record<string, [number, number]> = {
  abidjan: [-4.0083, 5.36],
  bingerville: [-3.89, 5.35],
  yamoussoukro: [-5.2767, 6.8276],
  'san-pedro': [-6.6363, 4.7485],
  bouake: [-5.0303, 7.6906],
  daloa: [-6.4502, 6.8774],
  korhogo: [-5.6296, 9.458],
  man: [-7.5536, 7.4125],
  gagnoa: [-5.9506, 6.1319],
  abengourou: [-3.4964, 6.7297],
  divo: [-5.3572, 5.8374],
  paris: [2.3522, 48.8566],
  lyon: [4.8357, 45.764],
  marseille: [5.3698, 43.2965],
  toulouse: [1.4442, 43.6047],
  bordeaux: [-0.5792, 44.8378],
  lille: [3.0573, 50.6292],
  dakar: [-17.4677, 14.7167],
  thies: [-16.926, 14.791],
  bamako: [-8.0029, 12.6392],
  ouagadougou: [-1.5197, 12.3714],
  'bobo-dioulasso': [-4.2979, 11.1771],
  montreal: [-73.5673, 45.5017],
  toronto: [-79.3832, 43.6532],
  ottawa: [-75.6972, 45.4215],
  vancouver: [-123.1207, 49.2827],
  bruxelles: [4.3517, 50.8503],
  liege: [5.5797, 50.6326],
  casablanca: [-7.5898, 33.5731],
  rabat: [-6.8498, 34.0209],
  marrakech: [-7.9811, 31.6295],
  londres: [-0.1276, 51.5072],
  london: [-0.1276, 51.5072],
  geneve: [6.1432, 46.2044],
  'new york': [-74.006, 40.7128],
  washington: [-77.0369, 38.9072],
  accra: [-0.187, 5.6037],
  douala: [9.7679, 4.0511],
  yaounde: [11.5021, 3.848],
};

const normalizeGeoString = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’`]/g, "'");

const resolveCountryMeta = (rawCountry: string): CountryMeta => {
  const key = normalizeGeoString(rawCountry || '');
  if (COUNTRY_CATALOG[key]) {
    return COUNTRY_CATALOG[key];
  }
  return {
    isoId: `custom-${key || 'unknown'}`,
    label: rawCountry || 'Autre pays',
    coords: [-3.89, 5.35],
  };
};

const resolveCityCoords = (city: string, countryMeta: CountryMeta): [number, number] => {
  const key = normalizeGeoString(city || '');
  return CITY_COORDS[key] || countryMeta.coords;
};

type RegionPreset = 'WORLD' | 'WEST_AFRICA' | 'EUROPE' | 'NORTH_AMERICA';

const REGION_TRANSFORMS: Record<RegionPreset, { scale: number; centerLonLat: [number, number]; label: string }> = {
  WORLD: { scale: 1, centerLonLat: [0, 15], label: 'Monde entier' },
  WEST_AFRICA: { scale: 4.5, centerLonLat: [-6, 11], label: 'Afrique de l’Ouest' },
  EUROPE: { scale: 4.2, centerLonLat: [5, 48], label: 'Europe' },
  NORTH_AMERICA: { scale: 3.0, centerLonLat: [-85, 45], label: 'Amérique du Nord' },
};

export const AlumniWorldMap: React.FC<AlumniWorldMapProps> = ({
  members,
  onViewCard,
  onContact,
}) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [promoDecadeFilter, setPromoDecadeFilter] = useState<'ALL' | 'DOYENS' | 'MID' | 'YOUNG'>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [showArcs, setShowArcs] = useState<boolean>(true);
  const [activeRegion, setActiveRegion] = useState<RegionPreset>('WORLD');
  const [selectedIsoId, setSelectedIsoId] = useState<string | null>(null);
  const [selectedCityKey, setSelectedCityKey] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    title: string;
    subtitle: string;
    count: number;
  } | null>(null);

  const sectors = useMemo(
    () => ['ALL', ...Array.from(new Set(members.map((m) => m.sector).filter(Boolean)))],
    [members]
  );

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (promoDecadeFilter === 'DOYENS' && m.promotionYear >= 1995) return false;
      if (promoDecadeFilter === 'MID' && (m.promotionYear < 1995 || m.promotionYear >= 2010)) return false;
      if (promoDecadeFilter === 'YOUNG' && m.promotionYear < 2010) return false;
      if (sectorFilter !== 'ALL' && m.sector !== sectorFilter) return false;
      return true;
    });
  }, [members, promoDecadeFilter, sectorFilter]);

  const { countryStatsList, countryMap, cityHubs } = useMemo(() => {
    const cMap = new Map<string, CountryStats>();
    const hMap = new Map<string, CityHub>();

    filteredMembers.forEach((member) => {
      const countryMeta = resolveCountryMeta(member.country);
      const existingCountry = cMap.get(countryMeta.isoId);
      if (existingCountry) {
        existingCountry.count += 1;
        if (member.isMentor) existingCountry.mentorsCount += 1;
        if (member.city && !existingCountry.cities.includes(member.city)) {
          existingCountry.cities.push(member.city);
        }
        existingCountry.members.push(member);
      } else {
        cMap.set(countryMeta.isoId, {
          isoId: countryMeta.isoId,
          label: countryMeta.label,
          count: 1,
          mentorsCount: member.isMentor ? 1 : 0,
          cities: member.city ? [member.city] : [],
          members: [member],
        });
      }

      const cityName = member.city || countryMeta.label;
      const cityKey = `${countryMeta.isoId}::${normalizeGeoString(cityName)}`;
      const existingHub = hMap.get(cityKey);
      if (existingHub) {
        existingHub.members.push(member);
      } else {
        hMap.set(cityKey, {
          key: cityKey,
          city: cityName,
          countryLabel: countryMeta.label,
          isoId: countryMeta.isoId,
          coords: resolveCityCoords(cityName, countryMeta),
          members: [member],
        });
      }
    });

    const sortedCountries = Array.from(cMap.values()).sort((a, b) => b.count - a.count);
    const hubs = Array.from(hMap.values()).sort((a, b) => b.members.length - a.members.length);

    return {
      countryStatsList: sortedCountries,
      countryMap: cMap,
      cityHubs: hubs,
    };
  }, [filteredMembers]);

  const diasporaCount = useMemo(
    () =>
      filteredMembers.filter(
        (m) => resolveCountryMeta(m.country).isoId !== '384'
      ).length,
    [filteredMembers]
  );

  const selectedMembers = useMemo(() => {
    if (selectedCityKey) {
      const hub = cityHubs.find((h) => h.key === selectedCityKey);
      return hub ? hub.members : [];
    }
    if (selectedIsoId) {
      return countryMap.get(selectedIsoId)?.members || [];
    }
    return filteredMembers;
  }, [selectedCityKey, selectedIsoId, cityHubs, countryMap, filteredMembers]);

  const selectedTerritoryLabel = useMemo(() => {
    if (selectedCityKey) {
      const hub = cityHubs.find((h) => h.key === selectedCityKey);
      return hub ? `${hub.city}, ${hub.countryLabel}` : 'Pôle sélectionné';
    }
    if (selectedIsoId) {
      return countryMap.get(selectedIsoId)?.label || 'Pays sélectionné';
    }
    return 'Monde entier (Tous les pôles)';
  }, [selectedCityKey, selectedIsoId, cityHubs, countryMap]);

  // Render & update D3 SVG map
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const width = 960;
    const height = 500;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const projection = d3
      .geoNaturalEarth1()
      .scale(175)
      .translate([width / 2, height / 2 + 12]);

    const pathGenerator = d3.geoPath(projection);
    const graticule = d3.geoGraticule10();

    // Main zoomable group
    const rootG = svg.append('g').attr('class', 'map-root');

    // Ocean sphere background
    rootG
      .append('path')
      .datum({ type: 'Sphere' } as d3.GeoPermissibleObjects)
      .attr('d', pathGenerator)
      .attr('fill', isDark ? '#141413' : '#FFFFFF')
      .attr('stroke', isDark ? '#2c2c29' : '#141413')
      .attr('stroke-opacity', isDark ? 1 : 0.12)
      .attr('stroke-width', 1.2);

    // Subtle graticule grid
    rootG
      .append('path')
      .datum(graticule)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', isDark ? '#1e1e1c' : '#EFEFEA')
      .attr('stroke-width', 0.7);

    // Parse world countries GeoJSON from bundled world-atlas TopoJSON
    const topology = countriesAtlas as unknown as Parameters<typeof feature>[0];
    const countriesObject = (countriesAtlas as unknown as { objects: { countries: Parameters<typeof feature>[1] } }).objects.countries;
    const worldGeo = feature(topology, countriesObject) as unknown as GeoJSON.FeatureCollection;

    const maxCountryCount = d3.max(countryStatsList, (d) => d.count) || 1;
    const countryColorScale = d3
      .scaleLinear<string>()
      .domain([1, Math.max(2, maxCountryCount)])
      .range(isDark ? ['#16324F', '#F2B705'] : ['#C7D5E5', '#16324F']);

    // Country polygons
    rootG
      .append('g')
      .attr('class', 'countries-layer')
      .selectAll('path')
      .data(worldGeo.features)
      .join('path')
      .attr('d', (d) => pathGenerator(d as d3.GeoPermissibleObjects) || '')
      .attr('fill', (d) => {
        const idStr = String(d.id || '');
        const stats = countryMap.get(idStr);
        if (stats && stats.count > 0) {
          return countryColorScale(stats.count);
        }
        return isDark ? '#262624' : '#EFEFEA';
      })
      .attr('stroke', (d) => {
        const idStr = String(d.id || '');
        if (selectedIsoId === idStr) return isDark ? '#F2B705' : '#141413';
        const stats = countryMap.get(idStr);
        return stats ? (isDark ? '#F2B705' : '#16324F') : (isDark ? '#3a3a37' : '#D4D4CE');
      })
      .attr('stroke-width', (d) => {
        const idStr = String(d.id || '');
        return selectedIsoId === idStr ? 1.5 : 0.6;
      })
      .style('cursor', (d) => (countryMap.has(String(d.id || '')) ? 'pointer' : 'default'))
      .on('mouseenter', function (event, d) {
        const idStr = String(d.id || '');
        const stats = countryMap.get(idStr);
        const countryName =
          stats?.label || String((d.properties as { name?: string })?.name || 'Territoire');

        if (stats) {
          d3.select(this).attr('stroke', isDark ? '#FFFFFF' : '#141413').attr('stroke-width', 1.4);
        }

        const rect = svgEl.getBoundingClientRect();
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          title: countryName,
          subtitle: stats
            ? `${stats.cities.slice(0, 3).join(', ')} · ${stats.mentorsCount} mentor(s)`
            : 'Aucun ancien enregistré dans ce pays',
          count: stats?.count || 0,
        });
      })
      .on('mousemove', (event) => {
        const rect = svgEl.getBoundingClientRect();
        setTooltip((prev) =>
          prev
            ? {
                ...prev,
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              }
            : null
        );
      })
      .on('mouseleave', function (_, d) {
        const idStr = String(d.id || '');
        const stats = countryMap.get(idStr);
        d3.select(this)
          .attr('stroke', selectedIsoId === idStr ? (isDark ? '#F2B705' : '#141413') : stats ? (isDark ? '#F2B705' : '#16324F') : (isDark ? '#3a3a37' : '#D4D4CE'))
          .attr('stroke-width', selectedIsoId === idStr ? 1.5 : 0.6);
        setTooltip(null);
      })
      .on('click', (_, d) => {
        const idStr = String(d.id || '');
        if (countryMap.has(idStr)) {
          setSelectedCityKey(null);
          setSelectedIsoId((prev) => (prev === idStr ? null : idStr));
        }
      });

    // Optional diaspora connection arcs from Bingerville to international hubs
    if (showArcs) {
      const diasporaHubs = cityHubs.filter((h) => h.isoId !== '384');
      const arcsGroup = rootG.append('g').attr('class', 'arcs-layer');

      diasporaHubs.forEach((hub) => {
        const lineFeature: GeoJSON.Feature<GeoJSON.LineString> = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [BINGERVILLE_COORDS, hub.coords],
          },
        };

        arcsGroup
          .append('path')
          .datum(lineFeature)
          .attr('d', (d) => pathGenerator(d as d3.GeoPermissibleObjects) || '')
          .attr('fill', 'none')
          .attr('stroke', isDark ? '#F2B705' : '#16324F')
          .attr('stroke-width', 1.1)
          .attr('stroke-dasharray', '4,3')
          .attr('stroke-opacity', isDark ? 0.65 : 0.55)
          .style('pointer-events', 'none');
      });
    }

    // Proportional city bubbles
    const maxHubCount = d3.max(cityHubs, (h) => h.members.length) || 1;
    const radiusScale = d3
      .scaleSqrt()
      .domain([1, Math.max(2, maxHubCount)])
      .range([6, 18]);

    const hubsGroup = rootG.append('g').attr('class', 'hubs-layer');

    const hubNodes = hubsGroup
      .selectAll('g.hub-node')
      .data(cityHubs)
      .join('g')
      .attr('class', 'hub-node')
      .attr('transform', (d) => {
        const projected = projection(d.coords);
        return projected ? `translate(${projected[0]}, ${projected[1]})` : 'translate(-100,-100)';
      })
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).select('circle.hub-circle').attr('stroke-width', 2.8);
        const rect = svgEl.getBoundingClientRect();
        const promos = Array.from(new Set(d.members.map((m) => m.promotionYear)))
          .sort((a, b) => a - b)
          .map((y) => `Promo ${y}`)
          .slice(0, 3)
          .join(', ');
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          title: `${d.city} (${d.countryLabel})`,
          subtitle: promos,
          count: d.members.length,
        });
      })
      .on('mousemove', (event) => {
        const rect = svgEl.getBoundingClientRect();
        setTooltip((prev) =>
          prev
            ? {
                ...prev,
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              }
            : null
        );
      })
      .on('mouseleave', function (_, d) {
        const isSelected = selectedCityKey === d.key;
        d3.select(this).select('circle.hub-circle').attr('stroke-width', isSelected ? 2.8 : 1.8);
        setTooltip(null);
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedIsoId(d.isoId);
        setSelectedCityKey((prev) => (prev === d.key ? null : d.key));
      });

    // Outer halo ring for selected city
    hubNodes
      .filter((d) => selectedCityKey === d.key)
      .append('circle')
      .attr('r', (d) => radiusScale(d.members.length) + 5)
      .attr('fill', 'none')
      .attr('stroke', '#F2B705')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.85);

    hubNodes
      .append('circle')
      .attr('class', 'hub-circle')
      .attr('r', (d) => radiusScale(d.members.length))
      .attr('fill', (d) => (selectedCityKey === d.key ? (isDark ? '#FFFFFF' : '#16324F') : '#F2B705'))
      .attr('stroke', (d) => (selectedCityKey === d.key ? '#F2B705' : (isDark ? '#141413' : '#16324F')))
      .attr('stroke-width', (d) => (selectedCityKey === d.key ? 2.8 : 1.8))
      .attr('fill-opacity', 0.94);

    hubNodes
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', (d) => (d.members.length >= 2 ? '9px' : '8px'))
      .attr('font-weight', '700')
      .attr('font-family', 'ui-monospace, SFMono-Regular, monospace')
      .attr('fill', (d) => (selectedCityKey === d.key ? (isDark ? '#141413' : '#F2B705') : '#141413'))
      .style('pointer-events', 'none')
      .text((d) => d.members.length);

    // D3 Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', (event) => {
        rootG.attr('transform', event.transform.toString());
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Apply current region focus transform cleanly
    if (activeRegion !== 'WORLD') {
      const preset = REGION_TRANSFORMS[activeRegion];
      const projected = projection(preset.centerLonLat);
      if (projected) {
        const tx = width / 2 - preset.scale * projected[0];
        const ty = height / 2 - preset.scale * projected[1];
        const targetTransform = d3.zoomIdentity.translate(tx, ty).scale(preset.scale);
        svg.call(zoom.transform, targetTransform);
      }
    }
  }, [countryMap, countryStatsList, cityHubs, selectedIsoId, selectedCityKey, showArcs, activeRegion, isDark]);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.5);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.67);
  };

  const handleResetView = () => {
    setActiveRegion('WORLD');
    setSelectedIsoId(null);
    setSelectedCityKey(null);
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(350)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  return (
    <div className="space-y-6">
      {/* KPI Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-4 shadow-editorial">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#4A4A48] dark:text-zinc-400 block">
            Anciens localisés
          </span>
          <div className="text-2xl font-heading font-bold text-[#141413] dark:text-white mt-1 tabular-nums">
            {filteredMembers.length}
          </div>
          <span className="text-[11px] text-[#4A4A48] dark:text-zinc-400">Fiches annuaire actives</span>
        </div>

        <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-4 shadow-editorial">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#4A4A48] dark:text-zinc-400 block">
            Pays représentés
          </span>
          <div className="text-2xl font-heading font-bold text-[#16324F] dark:text-[#F2B705] mt-1 tabular-nums">
            {countryStatsList.length}
          </div>
          <span className="text-[11px] text-[#4A4A48] dark:text-zinc-400">Sur l’ensemble des continents</span>
        </div>

        <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-4 shadow-editorial">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#4A4A48] dark:text-zinc-400 block">
            Villes & Pôles Alumni
          </span>
          <div className="text-2xl font-heading font-bold text-[#141413] dark:text-white mt-1 tabular-nums">
            {cityHubs.length}
          </div>
          <span className="text-[11px] text-[#4A4A48] dark:text-zinc-400">Foyers géographiques</span>
        </div>

        <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-4 shadow-editorial">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#4A4A48] dark:text-zinc-400 block">
            Diaspora Internationale
          </span>
          <div className="text-2xl font-heading font-bold text-[#141413] dark:text-white mt-1 tabular-nums">
            {diasporaCount}
          </div>
          <span className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
            Hors Côte d’Ivoire ({filteredMembers.length > 0 ? Math.round((diasporaCount / filteredMembers.length) * 100) : 0}%)
          </span>
        </div>
      </div>

      {/* Filters & Region Bar */}
      <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-4 sm:p-5 space-y-4 shadow-editorial">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#141413] dark:text-white mr-1 inline-flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#16324F] dark:text-[#F2B705]" />
              <span>Vue régionale :</span>
            </span>
            {(['WORLD', 'WEST_AFRICA', 'EUROPE', 'NORTH_AMERICA'] as RegionPreset[]).map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setActiveRegion(region)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeRegion === region
                    ? 'bg-[#16324F] dark:bg-[#F2B705] text-white dark:text-[#141413]'
                    : 'bg-[#F8F8F6] dark:bg-[#141413] text-[#4A4A48] dark:text-zinc-300 hover:text-[#141413] dark:hover:text-white border border-[#141413]/15 dark:border-white/15'
                }`}
              >
                {REGION_TRANSFORMS[region].label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <select
              value={promoDecadeFilter}
              onChange={(e) => setPromoDecadeFilter(e.target.value as typeof promoDecadeFilter)}
              aria-label="Filtrer par génération"
              className="bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 rounded-lg px-3 py-1.5 text-[#141413] dark:text-white focus:outline-none focus:border-[#F2B705]"
            >
              <option value="ALL">Toutes les générations</option>
              <option value="DOYENS">Doyens (Promos &lt; 1995)</option>
              <option value="MID">Promotions 1995 – 2009</option>
              <option value="YOUNG">Nouvelles promos (2010+)</option>
            </select>

            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              aria-label="Filtrer par secteur"
              className="bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 rounded-lg px-3 py-1.5 text-[#141413] dark:text-white focus:outline-none focus:border-[#F2B705]"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === 'ALL' ? 'Tous les secteurs' : sec}
                </option>
              ))}
            </select>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 rounded-lg text-xs text-[#141413] dark:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showArcs}
                onChange={(e) => setShowArcs(e.target.checked)}
                className="rounded border-[#141413]/25 accent-[#16324F] dark:accent-[#F2B705]"
              />
              <span>Flux Diaspora</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Split: D3 World Map + Interactive Territory Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: D3 SVG Interactive Map */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-4 sm:p-5 shadow-editorial space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#141413]/10 dark:border-white/10">
            <div>
              <h3 className="text-sm font-heading font-bold text-[#141413] dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#16324F] dark:text-[#F2B705]" />
                <span>Carte Interactive D3 — Répartition Mondiale ALGB</span>
              </h3>
              <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                Cliquez sur un pays ou une bulle de ville pour filtrer les anciens élèves correspondants. Zoomez avec la molette ou les boutons.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleZoomIn}
                aria-label="Zoomer"
                className="p-2 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] hover:bg-[#16324F] hover:text-white dark:hover:bg-[#F2B705] dark:hover:text-[#141413] text-[#141413] dark:text-white border border-[#141413]/15 dark:border-white/15 transition-colors cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                aria-label="Dézoomer"
                className="p-2 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] hover:bg-[#16324F] hover:text-white dark:hover:bg-[#F2B705] dark:hover:text-[#141413] text-[#141413] dark:text-white border border-[#141413]/15 dark:border-white/15 transition-colors cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetView}
                className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] hover:bg-[#16324F] hover:text-white dark:hover:bg-[#F2B705] dark:hover:text-[#141413] text-[#141413] dark:text-white border border-[#141413]/15 dark:border-white/15 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-xl border border-[#141413]/10 dark:border-white/10 bg-[#F8F8F6] dark:bg-[#141413]">
            <svg
              ref={svgRef}
              viewBox="0 0 960 500"
              className="w-full h-auto block select-none"
              role="img"
              aria-label="Carte mondiale D3 de la répartition géographique des anciens élèves ALGB"
            />

            {tooltip && (
              <div
                className="pointer-events-none absolute z-20 px-3 py-2 rounded-xl bg-[#141413] text-white shadow-xl border border-[#F2B705]/50 text-xs max-w-[230px]"
                style={{
                  left: Math.min(tooltip.x + 14, 520),
                  top: Math.max(tooltip.y - 12, 8),
                }}
              >
                <div className="font-heading font-bold text-[#F2B705]">{tooltip.title}</div>
                <div className="text-[11px] text-white font-mono mt-0.5">
                  {tooltip.count} ancien{tooltip.count > 1 ? 's' : ''} élève{tooltip.count > 1 ? 's' : ''}
                </div>
                {tooltip.subtitle && (
                  <div className="text-[10px] text-zinc-300 mt-0.5">{tooltip.subtitle}</div>
                )}
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#4A4A48] dark:text-zinc-400 pt-1">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#16324F] dark:bg-[#F2B705] border border-[#141413]/20 inline-block" />
                <span>Pays avec présence ALGB</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F2B705] border-2 border-[#16324F] dark:border-[#141413] inline-block" />
                <span>Pôle / Ville (taille proportionnelle)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 border-t-2 border-dashed border-[#16324F] dark:border-[#F2B705] inline-block" />
                <span>Liens depuis Bingerville</span>
              </span>
            </div>
            {(selectedIsoId || selectedCityKey) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedIsoId(null);
                  setSelectedCityKey(null);
                }}
                className="text-xs font-bold text-[#16324F] dark:text-[#F2B705] hover:underline cursor-pointer"
              >
                Afficher tous les pays
              </button>
            )}
          </div>
        </div>

        {/* Right: Selected Territory Alumni List & Country Ranking */}
        <div className="lg:col-span-4 space-y-5">
          {/* Country Ranking */}
          <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-5 shadow-editorial space-y-3">
            <div className="flex items-center justify-between border-b border-[#141413]/10 dark:border-white/10 pb-2.5">
              <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[#141413] dark:text-white">
                Répartition par Pays
              </h4>
              <span className="text-[11px] font-mono text-[#4A4A48] dark:text-zinc-400">
                {countryStatsList.length} pays
              </span>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {countryStatsList.map((stat) => {
                const pct =
                  filteredMembers.length > 0
                    ? Math.round((stat.count / filteredMembers.length) * 100)
                    : 0;
                const isSelected = selectedIsoId === stat.isoId && !selectedCityKey;

                return (
                  <button
                    key={stat.isoId}
                    type="button"
                    onClick={() => {
                      setSelectedCityKey(null);
                      setSelectedIsoId((prev) => (prev === stat.isoId ? null : stat.isoId));
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-[#F2B705]'
                        : 'bg-[#F8F8F6] dark:bg-[#141413] border-[#141413]/10 dark:border-white/10 hover:bg-white dark:hover:bg-[#1e1e1c] hover:border-[#16324F]/40 dark:hover:border-[#F2B705]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#141413] dark:text-white">{stat.label}</span>
                      <span className="font-mono font-bold text-[#16324F] dark:text-[#F2B705] tabular-nums">
                        {stat.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#141413]/10 dark:bg-white/10 rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-[#16324F] dark:bg-[#F2B705] rounded-sm"
                        style={{ width: `${Math.max(8, pct)}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Territory Members List */}
          <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-5 shadow-editorial space-y-3">
            <div className="flex items-center justify-between border-b border-[#141413]/10 dark:border-white/10 pb-2.5">
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#16324F] dark:text-[#F2B705] block">
                  Territoire affiché
                </span>
                <h4 className="text-sm font-heading font-bold text-[#141413] dark:text-white truncate">
                  {selectedTerritoryLabel}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 text-xs font-mono font-bold text-[#141413] dark:text-white shrink-0 tabular-nums">
                {selectedMembers.length}
              </span>
            </div>

            {selectedMembers.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#4A4A48] dark:text-zinc-400 space-y-2">
                <Users className="w-7 h-7 text-[#4A4A48]/40 dark:text-zinc-600 mx-auto" />
                <p>Aucun ancien élève ne correspond aux filtres dans cette zone.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#141413] dark:text-white truncate">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400 truncate">
                          {member.currentRole} · {member.company}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#16324F] dark:text-[#F2B705] shrink-0">
                        Promo {member.promotionYear}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-[#141413]/10 dark:border-white/10 text-[11px]">
                      <span className="text-[#4A4A48] dark:text-zinc-400 inline-flex items-center gap-1 truncate pr-2">
                        <MapPin className="w-3 h-3 text-[#16324F] dark:text-[#F2B705] shrink-0" />
                        <span className="truncate">
                          {member.city}, {member.country}
                        </span>
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onViewCard(member)}
                          className="text-[#16324F] dark:text-[#F2B705] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Carte</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onContact(member)}
                          className="px-2.5 py-1 rounded-lg bg-[#16324F] dark:bg-[#F2B705] hover:bg-[#1e4268] dark:hover:bg-[#dfa704] text-white dark:text-[#141413] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Contacter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

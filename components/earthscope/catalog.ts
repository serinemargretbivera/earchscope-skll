import {
  Activity,
  BookOpen,
  Compass,
  Database,
  Earth,
  FileText,
  Layers3,
  Leaf,
  SlidersHorizontal,
  Sparkles,
  Thermometer,
  Waves,
  type LucideIcon,
} from 'lucide-react'

export const VARIABLES = [
  {
    id: 'temperature',
    name: 'Air temperature',
    shortName: 'T2M',
    product: 'MERRA-2 · M2TMNXSLV',
    unit: 'Kelvin (K)',
    description: 'Monthly mean 2-meter air temperature from NASA’s atmospheric reanalysis.',
    sourceUrl: 'https://disc.gsfc.nasa.gov/datasets/M2TMNXSLV_5.12.4/summary',
    Icon: Thermometer,
    tone: 'cyan',
  },
  {
    id: 'rainfall',
    name: 'Precipitation',
    shortName: 'IMERG',
    product: 'GPM IMERG · GPM_3IMERGM',
    unit: 'mm/hr · product dependent',
    description: 'Monthly precipitation estimates from the GPM satellite-gauge product.',
    sourceUrl: 'https://gpm.nasa.gov/data/directory',
    Icon: Waves,
    tone: 'blue',
  },
  {
    id: 'vegetation',
    name: 'Vegetation health',
    shortName: 'NDVI',
    product: 'MODIS · MOD13C2',
    unit: 'NDVI · scaled product values',
    description: 'Monthly vegetation index with product-specific quality filtering required.',
    sourceUrl: 'https://lpdaac.usgs.gov/products/mod13c2v061/',
    Icon: Leaf,
    tone: 'green',
  },
] as const

export type VariableId = (typeof VARIABLES)[number]['id']
export type RegionName = 'Kerala' | 'Rajasthan' | 'Assam'
export type Section =
  | 'Overview'
  | 'Variable explorer'
  | 'Regional analysis'
  | 'Trend analysis'
  | 'Regional comparison'
  | 'Trend discovery'
  | 'AI Earth assistant'
  | 'Reports & downloads'
  | 'Data sources & methodology'

export const REGIONS: { name: RegionName; country: string; center: [number, number] }[] = [
  { name: 'Kerala', country: 'India', center: [76.3, 10.8] },
  { name: 'Rajasthan', country: 'India', center: [73.8, 26.8] },
  { name: 'Assam', country: 'India', center: [92.9, 26.2] },
]

export const NAV_GROUPS: { label: string; items: { name: Section; Icon: LucideIcon }[] }[] = [
  {
    label: 'EXPLORE',
    items: [
      { name: 'Overview', Icon: Compass },
      { name: 'Variable explorer', Icon: SlidersHorizontal },
      { name: 'Regional analysis', Icon: Earth },
      { name: 'Regional comparison', Icon: Layers3 },
    ],
  },
  {
    label: 'ANALYZE',
    items: [
      { name: 'Trend analysis', Icon: Activity },
      { name: 'Trend discovery', Icon: Sparkles },
      { name: 'AI Earth assistant', Icon: Sparkles },
    ],
  },
  {
    label: 'RESOURCES',
    items: [
      { name: 'Reports & downloads', Icon: FileText },
      { name: 'Data sources & methodology', Icon: BookOpen },
    ],
  },
]

export const SECTION_DESCRIPTIONS: Record<Section, string> = {
  Overview: 'A clear view of what is connected, what is known, and what is still waiting for observations.',
  'Variable explorer': 'Browse supported Earth-system variables and inspect their NASA collection records.',
  'Regional analysis': 'Choose a region and configure a study without confusing a map location for an observation.',
  'Trend analysis': 'Review statistical methods and result requirements before any trend is calculated.',
  'Regional comparison': 'Set up a transparent comparison across regions using the same verified source product.',
  'Trend discovery': 'Screen a validated collection of regional time series with multiple-testing correction.',
  'AI Earth assistant': 'Ask for plain-language explanations only after a reproducible analysis is available.',
  'Reports & downloads': 'Export traceable source metadata now; analysis reports appear after validated computation.',
  'Data sources & methodology': 'Inspect provenance, processing principles, and the limits of the current build.',
}

export const RESOURCE_ICON = Database

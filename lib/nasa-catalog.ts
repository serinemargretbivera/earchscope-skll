const CMR_BASE_URL = 'https://cmr.earthdata.nasa.gov/search/collections.json'

const PRODUCTS = [
  { key: 'temperature', shortName: 'M2TMNXSLV' },
  { key: 'rainfall', shortName: 'GPM_3IMERGM' },
  { key: 'vegetation', shortName: 'MOD13C2' },
] as const

type CmrEntry = {
  short_name?: string
  version_id?: string
  entry_id?: string
  time_start?: string
  time_end?: string
  updated?: string
  dataset_id?: string
}

type CmrResponse = {
  feed?: { updated?: string; entry?: CmrEntry[] }
}

export type ProductMetadata = {
  shortName: string
  entryId: string | null
  version: string | null
  timeStart: string | null
  timeEnd: string | null
  title: string | null
  registryUpdated: string | null
  status: 'available' | 'unavailable'
}

export type NasaCatalog = Record<(typeof PRODUCTS)[number]['key'], ProductMetadata>

function compareVersions(left: string, right: string) {
  const leftParts = left.split(/[.-]/).map((part) => Number(part) || 0)
  const rightParts = right.split(/[.-]/).map((part) => Number(part) || 0)
  const length = Math.max(leftParts.length, rightParts.length)
  for (let index = 0; index < length; index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0)
    if (difference !== 0) return difference
  }
  return 0
}

async function getProductMetadata(shortName: string): Promise<ProductMetadata> {
  const params = new URLSearchParams({ short_name: shortName, page_size: '100' })
  try {
    const response = await fetch(`${CMR_BASE_URL}?${params}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) throw new Error(`NASA CMR returned ${response.status}`)

    const data = (await response.json()) as CmrResponse
    const entries = (data.feed?.entry ?? []).filter((entry) => entry.version_id)
    entries.sort((left, right) => compareVersions(right.version_id ?? '', left.version_id ?? ''))
    const entry = entries[0]
    if (!entry) throw new Error('No matching collection was returned')

    return {
      shortName,
      entryId: entry.entry_id ?? null,
      version: entry.version_id ?? null,
      timeStart: entry.time_start ?? null,
      timeEnd: entry.time_end ?? null,
      title: entry.dataset_id ?? null,
      registryUpdated: data.feed?.updated ?? null,
      status: 'available',
    }
  } catch {
    return {
      shortName,
      entryId: null,
      version: null,
      timeStart: null,
      timeEnd: null,
      title: null,
      registryUpdated: null,
      status: 'unavailable',
    }
  }
}

export async function getNasaCatalog(): Promise<NasaCatalog> {
  const entries = await Promise.all(PRODUCTS.map(async ({ key, shortName }) => [
    key,
    await getProductMetadata(shortName),
  ] as const))
  return Object.fromEntries(entries) as NasaCatalog
}

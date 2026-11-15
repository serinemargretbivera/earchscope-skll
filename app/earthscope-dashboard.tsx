import type { NasaCatalog } from '@/lib/nasa-catalog'
import ObservatoryApp from '@/components/earthscope/observatory-app'

export default function EarthscopeDashboard({ catalog, initialSection }: { catalog: NasaCatalog; initialSection?: string }) {
  return <ObservatoryApp catalog={catalog} initialSection={initialSection} />
}

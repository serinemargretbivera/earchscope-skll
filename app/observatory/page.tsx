import EarthscopeDashboard from '../earthscope-dashboard'
import { getNasaCatalog } from '@/lib/nasa-catalog'

export default async function ObservatoryPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const [catalog, params] = await Promise.all([getNasaCatalog(), searchParams])
  return <EarthscopeDashboard catalog={catalog} initialSection={params.section} />
}

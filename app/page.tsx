import EarthscopeHome from '@/components/earthscope/earthscope-home'
import { getNasaCatalog } from '@/lib/nasa-catalog'

export default async function Page() {
  const catalog = await getNasaCatalog()
  return <EarthscopeHome catalog={catalog} />
}

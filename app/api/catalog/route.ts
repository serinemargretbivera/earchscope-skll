import { getNasaCatalog } from '@/lib/nasa-catalog'

export async function GET(request: Request) {
  const catalog = await getNasaCatalog()
  const format = new URL(request.url).searchParams.get('format')

  if (format === 'csv') {
    const rows = Object.values(catalog)
    const headers = ['shortName', 'entryId', 'version', 'timeStart', 'timeEnd', 'title', 'registryUpdated', 'status'] as const
    const escape = (value: string | null) => {
      const text = value ?? ''
      const spreadsheetSafe = /^[\u0000-\u0020]*[=+\-@]/.test(text) ? `'${text}` : text
      return `"${spreadsheetSafe.replaceAll('"', '""')}"`
    }
    const body = [headers.join(','), ...rows.map((row) => headers.map((key) => escape(row[key])).join(','))].join('\r\n')

    return new Response(body, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="earthscope-nasa-catalog.csv"',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  }

  return Response.json(catalog, {
    headers: {
      'Content-Disposition': 'attachment; filename="earthscope-nasa-catalog.json"',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}

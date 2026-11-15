# EARTHSCOPE development status

## Completed
- Cinematic, responsive landing page with an explicitly illustrative Earth visual and an editorial explanation of the platform.
- Separate `/observatory` application shell with Overview, Variable explorer, Regional analysis, Trend analysis, Regional comparison, Trend discovery, AI Earth assistant, Reports, and Methodology views.
- NASA CMR catalog lookup for MERRA-2, GPM IMERG, and MODIS MOD13C2, preserving catalog-only status and source metadata.
- MapLibre regional workspace with a public OpenFreeMap basemap, selectable map focus, and explicit disclosure that it is not a verified boundary or environmental data layer.
- Honest empty states for observations, statistical results, discoveries, assistant responses, and reports; unsupported findings and metrics are not fabricated.
- CSV and JSON downloads for NASA collection-catalog metadata.
- Responsive navigation, keyboard-visible focus styling, reduced-motion handling, updated page metadata, and baseline response security headers.

## Incomplete
- NASA Earthdata/CMR observation acquisition, authenticated services, and product metadata verification.
- Verified administrative boundaries, area-weighted geospatial extraction, and environmental map layers.
- Persistent scientific data store, processed observations, and background job execution.
- Statistical analysis engine (seasonality/autocorrelation-aware Mann–Kendall, Sen's slope, confidence intervals, and FDR correction).
- Live trend comparisons/discovery, AI explanations grounded in analysis, and PDF/CSV/PNG/JSON analysis reports.
- Onboarding flow, API schemas, and automated scientific-engine tests.

## Known limitations
- The interactive basemap depends on network access to OpenFreeMap and provides geographic context only.
- The map marker is an approximate focus point, not an administrative boundary or measurement location.
- The AI assistant, analysis actions, and result exports are intentionally unavailable until verified source observations and their validation pipelines exist.

## Data integration status
- NASA products are listed as catalog metadata only. No NASA observations have been fetched or processed, and no latest-data dates or trends are claimed.
- Product identifiers, versions, and units still require verification against current official collection metadata during pipeline implementation.
- Earthdata credentials, if required by the chosen access method, must remain backend-only.

## Scientific validation status
- No statistical results have been computed or validated.
- The interface explicitly distinguishes catalog metadata from observations and suppresses unsupported trend claims.

## Verification status
- `pnpm exec tsc --noEmit` passed.
- `pnpm build` passed.
- Browser checks covered desktop and mobile layouts, region selection, the public basemap, the trend/discovery empty states, and the CSV/JSON metadata exports. A later browser session recheck timed out after the final build restart.

## Deployment status
- Local Next.js preview only. No production deployment has been verified.

## Next implementation tasks
1. Verify current NASA collection metadata and determine an authorized retrieval/subsetting path for MERRA-2.
2. Implement a reproducible first data pipeline for the demonstration regions, preserving product version, units, quality and missingness.
3. Validate area-weighted regional aggregation and a seasonality/autocorrelation-aware trend engine against known test fixtures.
4. Connect backend persistence and job status, then enable the analysis UI only for successfully processed data.

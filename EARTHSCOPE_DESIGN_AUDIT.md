# EARTHSCOPE Design Audit

## Design decisions

EARTHSCOPE is built as one brand spanning several visual environments: Space Grotesk display typography, Inter interface copy, IBM Plex Mono technical labels, cyan as a restrained scientific accent, and a shared Earth/orbit identity. The public landing page uses a cinematic planetary image and transitions into light editorial sections. The observatory uses a compact mission-control shell around purpose-built section layouts. Motion is restrained to transitions and hover affordances; reduced-motion preferences are honored. The homepage artwork is explicitly identified as illustrative, and geographic context is clearly distinguished from measurement evidence.

Scientific trust takes precedence over decorative completeness. NASA collection-catalog records are presented as metadata, not observations. Until validated observation retrieval, region boundaries, and statistical calculations exist, analysis results, discovery rankings, AI explanations, and analysis exports remain unavailable rather than showing invented values.

## Page-by-page theme assignments

| Page | Visual world | Current treatment |
| --- | --- | --- |
| Homepage | Cosmic immersion / editorial science | Full-bleed Earth composition, oversized display headline, minimal navigation, then bright editorial storytelling and catalog sections. |
| Overview | Cybernetic mission control | Compact observatory shell, technical readouts, variable/source list, and explicit pipeline status. |
| Variable explorer | Futuristic minimalism / science archive | Searchable product catalog with metadata, provenance, archive dates, and clear observation status. |
| Regional analysis | Cosmic atlas / scientific workbench | Map-first regional setup with floating study controls and a clear disclosure that the basemap is context only. |
| Trend analysis | Data laboratory | Wide time-series canvas and statistical method/status region; no chart or statistics are fabricated. |
| Regional comparison | Parallel worlds | Paired regional panels with shared variable selection and synchronized comparison setup; result slots remain empty until compatible data exist. |
| Trend discovery | Digital frontier / discovery observatory | Distinct dark discovery introduction, orbital motif, scan scope, and transparent empty discovery feed. |
| AI Earth assistant | Futuristic minimalism | Spacious research-oriented assistant surface, evidence prerequisites, and explicit inactive state. |
| Reports & downloads | Scientific publication studio | Publication-oriented empty state with currently supported catalog metadata downloads. |
| Data sources & methodology | Editorial science future / open archive | Source catalog, product provenance, methodological principles, and visible processing limitations. |

## Components redesigned

- Marketing header, cinematic hero, section navigation, editorial story list, NASA collection cards, methodology section, and site footer.
- Observatory navigation rail, section breadcrumbs, compact search, overview modules, regional study controls, MapLibre view, time-series empty canvas, comparison panels, discovery feed, assistant empty state, and catalog/report surfaces.
- Shared typographic hierarchy, technical labels, focus-visible treatment, reduced-motion behavior, responsive layouts, and baseline security headers.

## Visual inconsistencies found

- The landing hero originally used generic supporting copy and calls to action; it has been updated to the requested “THE PLANET IS NEVER STILL.” message with “Enter Earthscope” and “Explore the Science” actions.
- Observatory pages share the same navigation shell by design, but need stronger page-specific visual differentiation than the present mostly light-panel treatment, particularly for methodology/report publication surfaces and the trend-analysis workspace.
- Some pages use compact utility typography. Maintain readable minimum text sizes as the layouts evolve, especially in technical labels and map footnotes.

## Performance issues

- The homepage hero image is prioritized and uses Next Image; avoid adding unnecessary large image assets or loading additional font families.
- MapLibre is dynamically imported client-side, limiting map code to the geographic workspace.
- The public basemap depends on an external tile service. Network availability can affect the map; provide a robust unavailable state and never treat it as environmental data.
- Avoid adding a 3D runtime solely for decoration. The current CSS orbital motif and Earth artwork provide depth without a WebGL dependency.

## Responsive issues

- Responsive rules exist for the landing page, observatory sidebar, map panels, grids, and mobile navigation. Continue testing the 728×605 desktop preview viewport and narrow mobile widths after layout changes.
- Long scientific metadata and control labels may need wrapping or scroll treatment at narrow widths; ensure they do not force page-level horizontal overflow.
- The map should preserve usable interaction dimensions on mobile while the sidebar remains keyboard-accessible.

## Remaining improvements

- Implement an authenticated NASA retrieval/subsetting pipeline and verify current product identifiers, versions, units, and quality rules against official metadata.
- Add verified administrative boundaries, quality-aware regional extraction, persistent observation storage, and reproducible job status.
- Validate seasonal/autocorrelation-aware trend statistics and multiple-testing correction against scientific fixtures before enabling result UI.
- Add meaningful result exports, evidence-grounded assistant responses, and onboarding only after those validated capabilities exist.
- Give the reports/methodology and trend-analysis pages stronger visual distinction while retaining legibility and shared navigation.
- Expand automated accessibility, responsive, and scientific-engine tests as backend capabilities are introduced.

## Verification snapshot

The previous implementation passed TypeScript and production build checks and had browser checks for desktop/mobile navigation, regional selection, map context, empty states, and catalog CSV/JSON exports. The homepage hero copy was updated in this pass; visual verification should be repeated for the current preview. No production deployment or NASA observation analysis is claimed.

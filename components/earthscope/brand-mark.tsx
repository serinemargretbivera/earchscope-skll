export default function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="9.25" stroke="currentColor" strokeWidth="1.35" />
      <path d="M7.15 15.1h17.7M8.65 20.2h14.7M8.65 10h14.7" stroke="currentColor" strokeWidth=".8" opacity=".72" />
      <path d="M16 6.75c2.2 2.25 3.3 5.3 3.3 9.25s-1.1 7-3.3 9.25c-2.2-2.25-3.3-5.3-3.3-9.25s1.1-7 3.3-9.25Z" stroke="currentColor" strokeWidth=".8" opacity=".72" />
      <ellipse cx="16" cy="16" rx="14" ry="5.1" transform="rotate(-28 16 16)" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="27.8" cy="10.4" r="1.35" fill="currentColor" />
    </svg>
  )
}

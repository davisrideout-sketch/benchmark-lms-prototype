export default function Wordmark({ light = false }) {
  return (
    <span className={`whitespace-nowrap font-display text-base font-bold sm:text-xl tracking-wide ${light ? 'text-white' : 'text-brand-600'}`}>
      Benchmark <span className={light ? 'text-taupe-200' : 'text-taupe-500'}>LMS</span>
    </span>
  )
}

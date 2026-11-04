export default function Wordmark({ light = false }) {
  return (
    <span className={`font-display text-xl font-bold tracking-wide ${light ? 'text-white' : 'text-brand-600'}`}>
      Benchmark <span className={light ? 'text-taupe-200' : 'text-taupe-500'}>LMS</span>
    </span>
  )
}

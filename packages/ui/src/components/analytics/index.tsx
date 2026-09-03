import { Analytics as VercelAnalytics } from "@vercel/analytics/react"

/**
 * Vercel Web Analytics component
 * 
 * Add this component to your app's root to enable Vercel Web Analytics.
 * 
 * @example
 * ```tsx
 * import { Analytics } from "@rehla-ui/ui"
 * 
 * function App() {
 *   return (
 *     <>
 *       {/* Your app content *\/}
 *       <Analytics />
 *     </>
 *   )
 * }
 * ```
 * 
 * @see https://vercel.com/docs/analytics/quickstart
 */
export const Analytics = VercelAnalytics

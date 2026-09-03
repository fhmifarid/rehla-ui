import { Button, Input } from "@rehla-ui/ui"
import { InformationCircle } from "@rehla-ui/ui/icons"

export default function App() {
  return (
    <div className="min-h-screen bg-ui-bg-base text-ui-fg-base p-8">
      <header className="flex items-center gap-2 mb-6">
        <InformationCircle className="w-6 h-6 text-ui-fg-muted" />
        <h1 className="text-2xl font-semibold">Rehla UI smoke test</h1>
      </header>

      <section className="space-y-4 max-w-md">
        <Input placeholder="Type your name" />

        <div className="flex gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
        </div>

        <div className="flex gap-2">
          <Button variant="transparent">Transparent</Button>
          <Button variant="primary" isLoading>
            Loading
          </Button>
        </div>
      </section>
    </div>
  )
}
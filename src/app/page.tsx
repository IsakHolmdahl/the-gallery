import { PromptForm } from '@/components/prompt-form'
import { LoadingState } from '@/components/loading-state'

function Page() {
  // For Phase 1: Show LoadingState when form is pending
  // Phase 2 will integrate real generation state

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-serif tracking-tight mb-2">The Gallery</h1>
        <p className="text-lg text-muted-foreground">Curate your vision</p>
      </header>
      <PromptForm />
      {/* LoadingState will be shown based on form state in Phase 2 */}
      {/* For now, PromptForm button handles loading indication */}
    </main>
  )
}

export default Page
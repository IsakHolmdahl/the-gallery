import { PromptForm } from '@/components/prompt-form'

function Page() {
  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Elegant header */}
      <header className="text-center mb-16">
        <h1 className="text-6xl md:text-7xl font-serif tracking-tight text-stone-900 mb-4">
          The Gallery
        </h1>
        <p className="text-lg md:text-xl text-stone-500 tracking-widest uppercase">
          Curate your vision
        </p>
      </header>

      {/* Gallery-style presentation for the form */}
      <div className="w-full max-w-xl">
        {/* Elegant frame/border treatment */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200/60 p-8 md:p-10">
          {/* Inner frame line for gallery feel */}
          <div className="absolute inset-2 rounded-xl border border-stone-300/40 pointer-events-none" />
          
          <PromptForm />
        </div>
      </div>

      {/* Subtle footer */}
      <footer className="absolute bottom-8 text-center">
        <p className="text-xs text-stone-400 tracking-widest uppercase">
          An ephemeral experience
        </p>
      </footer>
    </main>
  )
}

export default Page

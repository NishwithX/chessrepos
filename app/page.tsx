import { ChessAnalysis } from '@/components/ChessAnalysis'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Chess Analysis</h1>
      <ChessAnalysis />
    </main>
  )
}


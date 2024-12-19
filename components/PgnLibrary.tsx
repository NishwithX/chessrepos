import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PgnLibraryProps {
  pgnLibrary: { name: string; pgn: string }[]
  loadPgn: (pgn: string) => void
  displayAllPgns: () => void
}

const PgnLibrary: React.FC<PgnLibraryProps> = ({ pgnLibrary, loadPgn, displayAllPgns }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">PGN Library</h3>
      <ScrollArea className="h-24">
        <div className="flex flex-wrap gap-2">
          {pgnLibrary.map((item, index) => (
            <Button key={index} onClick={() => loadPgn(item.pgn)} variant="outline" size="sm">
              {item.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <Button onClick={displayAllPgns} className="mt-2 w-full">Display All PGNs</Button>
    </div>
  )
}

export default PgnLibrary


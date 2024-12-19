import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Move } from '@/utils/pgnUtils'
import { LayoutGrid, List } from 'lucide-react'

interface MoveListProps {
  moves: Move[]
  currentMove: number
  onSelectMove: (index: number) => void
}

const MoveList: React.FC<MoveListProps> = ({ moves, currentMove, onSelectMove }) => {
  const [isGridView, setIsGridView] = useState(false)

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <Button onClick={() => setIsGridView(!isGridView)} size="sm" variant="outline">
          {isGridView ? <List className="mr-1" /> : <LayoutGrid className="mr-1" />}
          {isGridView ? 'List View' : 'Grid View'}
        </Button>
      </div>
      <ScrollArea className="h-64">
        <div className={`${isGridView ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
          {moves.map((move, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                index === currentMove ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              } cursor-pointer hover:bg-primary/80 hover:text-primary-foreground transition-colors`}
              onClick={() => onSelectMove(index)}
            >
              {move.number}. {move.white} {move.black}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default MoveList


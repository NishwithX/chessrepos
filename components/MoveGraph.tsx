import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  MarkerType,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import { Game, Move } from '@/utils/pgnUtils'
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Maximize2, Minimize2, Focus, Lock, MoveIcon } from 'lucide-react'

interface MoveGraphProps {
  games: Game[]
  currentMove: number
  onSelectMove: (gameIndex: number, moveIndex: number) => void
}

const NODE_WIDTH = 160
const NODE_HEIGHT = 40
const HORIZONTAL_GAP = 40
const VERTICAL_GAP = 60

const MoveGraph: React.FC<MoveGraphProps> = ({ games, currentMove, onSelectMove }) => {
  const [isVertical, setIsVertical] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const flowRef = useRef<ReactFlowInstance | null>(null)
  const [isDragMode, setIsDragMode] = useState(false)

  const createNodesAndEdges = useCallback((games: Game[], isVertical: boolean, currentMove: number): { nodes: Node[], edges: Edge[] } => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    const positionMap = new Map<string, string>()

    const addNode = (move: Move, gameIndex: number, moveIndex: number, x: number, y: number) => {
      const nodeId = `game-${gameIndex}-${moveIndex}`
      const moveText = `${move.number}. ${move.white} ${move.black || ''}`
      nodes.push({
        id: nodeId,
        data: { label: moveText, fen: move.fen, gameIndex, moveIndex },
        position: { x, y },
        style: {
          background: nodeId === `game-0-${currentMove}` ? '#3b82f6' : '#f3f4f6',
          color: nodeId === `game-0-${currentMove}` ? 'white' : 'black',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '8px',
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px',
        },
        sourcePosition: isVertical ? Position.Bottom : Position.Right,
        targetPosition: isVertical ? Position.Top : Position.Left,
      })
      return nodeId
    }

    const processGame = (game: Game, gameIndex: number, startX: number, startY: number) => {
      let lastNodeId = 'start'
      let x = startX
      let y = startY

      game.moves.forEach((move, moveIndex) => {
        const key = `${move.number}-${move.white}-${move.black}`
        if (!positionMap.has(key)) {
          const nodeId = addNode(move, gameIndex, moveIndex, x, y)
          positionMap.set(key, nodeId)

          edges.push({
            id: `edge-${gameIndex}-${moveIndex}`,
            source: lastNodeId,
            target: nodeId,
            type: 'smoothstep',
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
            sourceHandle: isVertical ? 'bottom' : 'right',
            targetHandle: isVertical ? 'top' : 'left',
          })

          lastNodeId = nodeId
          if (isVertical) {
            y += NODE_HEIGHT + VERTICAL_GAP
          } else {
            x += NODE_WIDTH + HORIZONTAL_GAP
          }
        } else {
          const existingNodeId = positionMap.get(key)!
          edges.push({
            id: `edge-${gameIndex}-${moveIndex}`,
            source: lastNodeId,
            target: existingNodeId,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#10b981', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
            sourceHandle: isVertical ? 'bottom' : 'right',
            targetHandle: isVertical ? 'top' : 'left',
          })
          lastNodeId = existingNodeId
        }
      })
    }

    games.forEach((game, index) => {
      const startX = isVertical ? index * (NODE_WIDTH + HORIZONTAL_GAP) : 0
      const startY = isVertical ? 0 : index * (NODE_HEIGHT + VERTICAL_GAP)
      processGame(game, index, startX, startY)
    })

    return { nodes, edges }
  }, [])

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => createNodesAndEdges(games, isVertical, currentMove), [games, isVertical, currentMove, createNodesAndEdges])
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(games, isVertical, currentMove)
    setNodes(newNodes)
    setEdges(newEdges)
  }, [games, isVertical, currentMove, createNodesAndEdges])

  const onLayout = useCallback(() => {
    setIsVertical(prev => !prev)
  }, [])

  const focusOnCurrentMove = useCallback(() => {
    if (flowRef.current) {
      flowRef.current.fitView({
        duration: 300,
        padding: 0.2,
        minZoom: 0.5,
        maxZoom: 1
      })
    }
  }, [])

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-background p-4' : 'h-[400px]'} mb-4`}>
      <div className="flex justify-end gap-2 mb-2">
        <Button onClick={focusOnCurrentMove} size="sm" variant="outline">
          <Focus className="mr-1" />
          Focus
        </Button>
        <Button onClick={onLayout} size="sm" variant="outline">
          {isVertical ? <ArrowUpWideNarrow className="mr-1" /> : <ArrowDownWideNarrow className="mr-1" />}
          {isVertical ? 'Horizontal' : 'Vertical'}
        </Button>
        <Button onClick={() => setIsFullScreen(prev => !prev)} size="sm" variant="outline">
          {isFullScreen ? <Minimize2 className="mr-1" /> : <Maximize2 className="mr-1" />}
          {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
        </Button>
        <Button onClick={() => setIsDragMode(prev => !prev)} size="sm" variant="outline">
          {isDragMode ? (
            <>
              <Lock className="mr-1" />
              Lock View
            </>
          ) : (
            <>
              <MoveIcon className="mr-1" />
              Free Move
            </>
          )}
        </Button>
      </div>
      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => onSelectMove(node.data.gameIndex, node.data.moveIndex)}
          panOnDrag={isDragMode}
          panOnScroll={false}
          zoomOnScroll={true}
          nodesDraggable={false}
          preventScrolling={true}
          minZoom={0.1}
          maxZoom={4}
          fitView
          onInit={instance => (flowRef.current = instance)}
          className="react-flow-container"
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

export default MoveGraph


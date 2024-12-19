"use client"

import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard as ReactChessboard } from 'react-chessboard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ChessboardProps {
  currentPosition: string
  onNext: () => void
  onPrev: () => void
}

const Chessboard: React.FC<ChessboardProps> = ({ currentPosition, onNext, onPrev }) => {
  const [chess, setChess] = useState<Chess>(new Chess())

  useEffect(() => {
    const newChess = new Chess()
    if (currentPosition === 'start') {
      // Use the default starting position
      setChess(newChess)
    } else {
      try {
        newChess.load(currentPosition)
        setChess(newChess)
      } catch (error) {
        console.error('Invalid FEN:', error)
        // Fallback to starting position if FEN is invalid
        setChess(new Chess())
      }
    }
  }, [currentPosition])

  return (
    <div className="mb-4">
      <ReactChessboard position={chess.fen()} boardWidth={350} />
      <div className="flex justify-center mt-4">
        <Button onClick={onPrev} className="mr-2" size="sm">
          <ChevronLeft className="mr-1" /> Previous
        </Button>
        <Button onClick={onNext} size="sm">
          Next <ChevronRight className="ml-1" />
        </Button>
      </div>
    </div>
  )
}

export default Chessboard


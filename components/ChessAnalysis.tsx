'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import PgnInput from './PgnInput'
import Chessboard from './Chessboard'
import MoveList from './MoveList'
import MoveGraph from './MoveGraph'
import PgnLibrary from './PgnLibrary'
import { useChessState } from '@/utils/useChessState'

export function ChessAnalysis() {
  const {
    games,
    pgnLibrary,
    currentMove,
    addPgn,
    loadPgn,
    clearGames,
    goToMove,
    nextMove,
    prevMove,
    displayAllPgns,
  } = useChessState()

  const [currentGameIndex, setCurrentGameIndex] = useState(0)

  const currentGame = games[currentGameIndex]

  const handleSelectMove = (gameIndex: number, moveIndex: number) => {
    setCurrentGameIndex(gameIndex)
    goToMove(moveIndex)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <PgnInput addPgn={addPgn} />
          {currentGame && (
            <Chessboard
              currentPosition={currentGame.moves[currentMove]?.fen || 'start'}
              onNext={nextMove}
              onPrev={prevMove}
            />
          )}
          {currentGame && (
            <MoveList
              moves={currentGame.moves}
              currentMove={currentMove}
              onSelectMove={(index) => handleSelectMove(currentGameIndex, index)}
            />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <MoveGraph
            games={games}
            currentMove={currentMove}
            onSelectMove={handleSelectMove}
          />
          <PgnLibrary pgnLibrary={pgnLibrary} loadPgn={loadPgn} displayAllPgns={displayAllPgns} />
        </CardContent>
      </Card>
    </div>
  )
}


import { useState, useEffect, useCallback, useMemo } from 'react'
import { Game, parsePgn, mergePgns, findTranspositions } from './pgnUtils'

interface ChessState {
  games: Game[]
  pgnLibrary: { name: string; pgn: string }[]
  currentMove: number
  addPgn: (name: string, pgn: string) => void
  loadPgn: (pgn: string) => void
  clearGames: () => void
  goToMove: (index: number) => void
  nextMove: () => void
  prevMove: () => void
  displayAllPgns: () => void
}

const LOCAL_STORAGE_KEY = 'chess-analysis-tool'

export function useChessState(): ChessState {
  const [games, setGames] = useState<Game[]>([])
  const [pgnLibrary, setPgnLibrary] = useState<{ name: string; pgn: string }[]>([])
  const [currentMove, setCurrentMove] = useState(0)

  const loadPgn = useCallback((pgn: string) => {
    try {
      const newGame = parsePgn(pgn)
      setGames(prevGames => {
        const mergedGames = prevGames.map(game => mergePgns(game, newGame))
        if (!mergedGames.some(game => game.moves.length === newGame.moves.length)) {
          mergedGames.push(newGame)
        }
        return mergedGames.map(findTranspositions)
      })
      setCurrentMove(0)
    } catch (error) {
      console.error('Error loading PGN:', error)
    }
  }, [])

  const addPgn = useCallback((name: string, pgn: string) => {
    setPgnLibrary(prev => [...prev, { name, pgn }])
    loadPgn(pgn)
  }, [loadPgn])

  const clearGames = useCallback(() => {
    setGames([])
    setCurrentMove(0)
  }, [])

  const goToMove = useCallback((moveIndex: number) => {
    setCurrentMove(moveIndex)
  }, [])

  const nextMove = useCallback(() => {
    setCurrentMove(prev => {
      const maxMoves = Math.max(...games.map(game => game.moves.length))
      return prev < maxMoves - 1 ? prev + 1 : prev
    })
  }, [games])

  const prevMove = useCallback(() => {
    setCurrentMove(prev => Math.max(0, prev - 1))
  }, [])

  const displayAllPgns = useCallback(() => {
    pgnLibrary.forEach(({ pgn }) => loadPgn(pgn))
  }, [pgnLibrary, loadPgn])

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedData) {
      const { library, games, move } = JSON.parse(storedData)
      setPgnLibrary(library)
      setGames(games)
      setCurrentMove(move)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      library: pgnLibrary,
      games,
      move: currentMove
    }))
  }, [pgnLibrary, games, currentMove])

  const state = useMemo(() => ({
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
  }), [games, pgnLibrary, currentMove, addPgn, loadPgn, clearGames, goToMove, nextMove, prevMove, displayAllPgns])

  return state
}


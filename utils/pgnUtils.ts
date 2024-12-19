import { Chess } from 'chess.js'

export interface Move {
  number: number
  white: string
  black: string | null
  fen: string
}

export interface Game {
  moves: Move[]
  variations: Game[]
}

export function parsePgn(pgn: string): Game {
  const chess = new Chess()
  chess.loadPgn(pgn)

  const moves: Move[] = []
  let moveNumber = 1
  let whiteTurn = true
  let currentMove: Partial<Move> = { number: moveNumber }

  chess.history({ verbose: true }).forEach((move) => {
    if (whiteTurn) {
      currentMove.white = move.san
      currentMove.fen = move.after
    } else {
      currentMove.black = move.san
      moves.push(currentMove as Move)
      moveNumber++
      currentMove = { number: moveNumber }
    }
    whiteTurn = !whiteTurn
  })

  // Push the last move if it's a white move without a black response
  if (currentMove.white) {
    currentMove.black = null
    moves.push(currentMove as Move)
  }

  return { moves, variations: [] }
}

export function mergePgns(game1: Game, game2: Game): Game {
  const mergedMoves: Move[] = []
  const variations: Game[] = []
  let i = 0
  let j = 0

  while (i < game1.moves.length && j < game2.moves.length) {
    if (game1.moves[i].white === game2.moves[j].white && game1.moves[i].black === game2.moves[j].black) {
      mergedMoves.push(game1.moves[i])
      i++
      j++
    } else {
      variations.push({ moves: game2.moves.slice(j), variations: [] })
      break
    }
  }

  if (i < game1.moves.length) {
    mergedMoves.push(...game1.moves.slice(i))
  }

  if (j < game2.moves.length) {
    variations.push({ moves: game2.moves.slice(j), variations: [] })
  }

  return { moves: mergedMoves, variations }
}

export function findTranspositions(game: Game): Game {
  const positionMap = new Map<string, number>()
  const transpositions: [number, number][] = []

  game.moves.forEach((move, index) => {
    if (positionMap.has(move.fen)) {
      transpositions.push([positionMap.get(move.fen)!, index])
    } else {
      positionMap.set(move.fen, index)
    }
  })

  // For simplicity, we're not modifying the game structure here.
  // In a real implementation, you might want to create a more complex structure
  // that represents the transpositions within the game.

  return game
}


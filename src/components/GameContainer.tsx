import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { GameBoard } from './GameBoard'
import { Splash } from './Splash'
import { GameOptions } from './GameOptions'
import { css } from 'emotion'

export interface GameContainerProps {}

// TODO: Add these as user options in the future
const WIDTH = 30
const HEIGHT = 16
const CELL_SIZE = 20
const MINE_COUNT = 50
const MINE = 9

export type handleCellClickType = (
    position: PositionType,
    action?: CellClickAction
) => void

const makeEmptyCell = (): Cell => ({
    isChecked: false,
    isFlag: false,
    value: 0 as CellValue,
})

export const GameContainer = () => {
    const initialCellState = generateEmptyBoardArray(WIDTH, HEIGHT)
    const [gameState, setGameState] = useState<GameState>('PLAYING')
    const [cellState, setCellState]: [Cell[][], any] = useState(
        initialCellState
    )

    const resetGame = () => {
        const setMinePosition = array => {
            const updateCells = array.slice()
            for (let i = 0; i < MINE_COUNT; i++) {
                const mine_x = Math.floor(Math.random() * WIDTH)
                const mine_y = Math.floor(Math.random() * HEIGHT)
                updateCells[mine_y][mine_x].value = MINE
            }
            return updateCells
        }
        const setNumberValue = array => {
            return array.map((row, y) => {
                return row.map((cell, x) => {
                    return cell.value !== MINE
                        ? {
                              ...cell,
                              value: getMineCount(array, {
                                  x,
                                  y,
                              }),
                          }
                        : cell
                })
            })
        }
        console.log('init mines')
        const newGameBoard = generateEmptyBoardArray(WIDTH, HEIGHT)
        console.log(newGameBoard)
        setCellState(setNumberValue(setMinePosition(newGameBoard)))
    }

    useEffect(() => {
        resetGame()
    }, [])

    useEffect(() => {
        if (gameState === 'LOST') {
            setTimeout(() => {
                resetGame()
                setGameState('PLAYING')
            }, 3000)
        }
    }, [gameState])

    /* * *  Event Handlers * * */

    const handleClear = () => {
        event.preventDefault()
        setCellState(initialCellState)
    }

    //If paused then toggle the clicked cell living or dead
    const handleCellClick: handleCellClickType = (position, action) => {
        if (gameState !== 'PLAYING') {
            return
        }
        const updateCells = cellState.slice()
        const { x, y } = position
        const clickedCell = updateCells[y][x]
        const isFlag = clickedCell.isFlag
        if (action === 'CHECK' && !cellState[y][x].isFlag) {
            // updateCells[y][x].isChecked = true
            if (cellState[y][x].value === MINE) {
                console.log('GAME OVER')
                setCellState(revealMines(cellState))
                setGameState('LOST')
            } else {
                const checkedCells = checkCell(cellState, position)
                console.log(checkedCells)
                if (isMineTriggered(checkedCells)) {
                    console.log('GAME OVER')
                    setCellState(revealMines(cellState))
                    setGameState('LOST')
                } else {
                    setCellState(checkedCells)
                }
            }
        }
        if (action === 'FLAG') {
            updateCells[y][x].isFlag = !isFlag
            setCellState(updateCells)
        }
    }

    return (
        <div
            className={css`
                display: flex;
            `}
        >
            <GameBoard
                width={WIDTH}
                height={HEIGHT}
                cellSize={CELL_SIZE}
                cellState={cellState}
                onCellClick={handleCellClick}
            />
            <Splash text="GAME OVER" open={gameState === 'LOST'} />
            {/* <GameOptions onClear={handleClear} /> */}
        </div>
    )
}

const generateEmptyBoardArray = (width: number, height: number) => {
    return [...Array(height)].map(_ =>
        [...Array(width)].map(_ => makeEmptyCell())
    )
}

const getMineCount = (
    array,
    currentIndex: { x: number; y: number }
): CellValue => {
    const { x, y } = currentIndex
    const row_length = array.length
    const col_length = array[0].length
    let neighborCount: CellValue = 0
    const neighborExists = (x: number, y: number) => {
        return (
            x < col_length &&
            x >= 0 &&
            y < row_length &&
            y >= 0 &&
            array[y][x].value === MINE
        )
    }

    // 0 top-left
    if (neighborExists(x - 1, y - 1)) {
        neighborCount += 1
    }
    // 1 top
    if (neighborExists(x, y - 1)) {
        neighborCount += 1
    }
    // 2 top-right
    if (neighborExists(x + 1, y - 1)) {
        neighborCount += 1
    }
    // 3 right
    if (neighborExists(x + 1, y)) {
        neighborCount += 1
    }
    // 4 bottom-right
    if (neighborExists(x + 1, y + 1)) {
        neighborCount += 1
    }
    // 5 bottom
    if (neighborExists(x, y + 1)) {
        neighborCount += 1
    }
    // 6 bottom-left
    if (neighborExists(x - 1, y + 1)) {
        neighborCount += 1
    }
    // 7 left
    if (neighborExists(x - 1, y)) {
        neighborCount += 1
    }

    //console.log(neighborCount)

    return neighborCount as CellValue
}

const checkCell = (arr, currentIndex: { x: number; y: number }): Cell[] => {
    const array = arr.slice()
    const { x, y } = currentIndex

    if (array[y][x].isFlag) {
        return array
    }

    let flagCount = 0

    if (array[y][x].isChecked) {
        mapSelfAndNeighbors(
            (cell, mapArray, position) => {
                cell.isFlag && flagCount++
                return cell
                // return { ...cell, isChecked: true }
            },
            array,
            currentIndex
        )
        console.log(flagCount === array[y][x].value)
        if (flagCount === array[y][x].value) {
            return mapSelfAndNeighbors(
                (cell, mapArray, position) => {
                    return position !== currentIndex && !cell.isChecked
                        ? checkCell(mapArray, position)[position.y][position.x]
                        : { ...cell, isChecked: true }
                },
                array,
                currentIndex
            )
        }
        return array
    }

    if (array[y][x].value > 0 && array[y][x].value < 10) {
        array[y][x].isChecked = true
        return array
    }
    if (array[y][x].value === 0) {
        return mapSelfAndNeighbors(
            (cell, mapArray, position) => {
                return position !== currentIndex && !cell.isChecked
                    ? checkCell(mapArray, position)[position.y][position.x]
                    : { ...cell, isChecked: true }
                // return { ...cell, isChecked: true }
            },
            array,
            currentIndex
        )
    }

    return array
}

const isMineTriggered = array => {
    const checkedMines = array.filter(row => {
        const checkedMinesInRow = row.filter(
            cell => cell.isChecked && cell.value === MINE
        )
        return checkedMinesInRow.length > 0
    })

    return checkedMines.length > 0
}

const mapSelfAndNeighbors = (
    fn,
    arr,
    currentIndex: { x: number; y: number }
) => {
    const array = arr.slice()
    const { x, y } = currentIndex
    const row_length = array.length
    const col_length = array[0].length

    const top = y - 1
    const bottom = y + 1
    const left = x - 1
    const right = x + 1

    const neighborExists = (x: number, y: number) => {
        return x < col_length && x >= 0 && y < row_length && y >= 0
    }

    // self
    array[y][x] = fn(array[y][x], array, currentIndex)

    // 0 top-left
    if (neighborExists(left, top)) {
        array[top][left] = fn(array[top][left], array, { x: left, y: top })
    }
    // 1 top
    if (neighborExists(x, top)) {
        array[top][x] = fn(array[top][x], array, { x, y: top })
    }
    // 2 top-right
    if (neighborExists(right, top)) {
        array[top][right] = fn(array[top][right], array, { x: right, y: top })
    }
    // 3 right
    if (neighborExists(right, y)) {
        array[y][right] = fn(array[y][right], array, { x: right, y })
    }
    // 4 bottom-right
    if (neighborExists(right, bottom)) {
        array[bottom][right] = fn(array[bottom][right], array, {
            x: right,
            y: bottom,
        })
    }
    // 5 bottom
    if (neighborExists(x, bottom)) {
        array[bottom][x] = fn(array[bottom][x], array, { x, y: bottom })
    }
    // 6 bottom-left
    if (neighborExists(left, bottom)) {
        array[bottom][left] = fn(array[bottom][left], array, {
            x: left,
            y: bottom,
        })
    }
    // 7 left
    if (neighborExists(left, y)) {
        array[y][left] = fn(array[y][left], array, { x: left, y })
    }

    //console.log(neighborCount)

    return array
}

const revealMines = array => {
    return array.map(row => {
        return row.map(cell => {
            return cell.value === MINE ? { ...cell, isChecked: true } : cell
        })
    })
}

const directionMap = {
    left: -1,
    right: 1,
    center: 0,
    top: -1,
    bottom: 1,
}

const getNeighborPositions = position => {
    const _left = -1
    const _right = 1
    const _top = -1
    const _bottom = 1

    const top_left = {
        x: position.x + _top,
        y: position.y + _left,
    }
    const top = { x: position.x, y: position.y + _top }
    const top_right = {
        x: position.x + _right,
        y: position.y + _top,
    }
    const left = {
        x: position.x + _left,
        y: position.y,
    }
    const right = {
        x: position.x + _right,
        y: position.y,
    }
    const bottom_left = {
        x: position.x + _left,
        y: position.y + _bottom,
    }
    const bottom = {
        x: position.x,
        y: position.y + _bottom,
    }
    const bottom_right = {
        x: position.x + _right,
        y: position.y + _bottom,
    }

    return {
        top_left,
        top,
        top_right,
        left,
        right,
        bottom_left,
        bottom,
        bottom_right,
    }
}

export default GameContainer

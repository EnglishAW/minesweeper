import { h } from 'preact'
import { css } from 'emotion'
import { Cell } from './Cell'
import { handleCellClickType } from './GameContainer'

export interface GameBoardProps {
    width: number
    height: number
    cellSize: number
    cellState: Cell[][]
    onCellClick: handleCellClickType
}

// Nice statless way to render our cells based on the array from the GameContainer
export const GameBoard = (props: GameBoardProps) => {
    const { cellState, cellSize, width, height, onCellClick } = props
    return (
        <div className={wrapperClass(width, height, cellSize)}>
            {cellState.map((row, y) => {
                return row.map((cell, x) => {
                    return (
                        <Cell
                            size={cellSize}
                            isMine={cell.value === 9}
                            isChecked={cell.isChecked}
                            isFlag={cell.isFlag}
                            value={cell.value}
                            position={{ x, y }}
                            onClick={onCellClick}
                        />
                    )
                })
            })}
        </div>
    )
}

const wrapperClass = (width, height, cellSize) => css`
    display: flex;
    flex-flow: row wrap;
    width: ${width * cellSize};
    height: ${height * cellSize};

    background-color: transparent;
`

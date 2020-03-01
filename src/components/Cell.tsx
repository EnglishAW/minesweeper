import { h } from 'preact'
import { css } from 'emotion'
import { handleCellClickType } from './GameContainer'
import { useState } from 'preact/hooks/src'

export interface CellProps {
    isMine: boolean
    isChecked: boolean
    isFlag: boolean
    value: CellValue
    size: number
    position: { x: number; y: number }
    onClick: handleCellClickType
}

// Render the Cell based on the array from the GameContainer
export const Cell = (props: CellProps) => {
    const { size, position, onClick, value, isChecked, isFlag, isMine } = props
    return (
        <div
            className={wrapperClass(size, isChecked, isFlag, isMine)}
            onContextMenu={event => event.preventDefault()}
            onMouseUp={event => {
                event.preventDefault()
                if (!isFlag && event.button === 0) {
                    onClick({ x: position.x, y: position.y }, 'CHECK')
                }
            }}
            onMouseDown={event => {
                event.preventDefault()
                if (!isFlag && !isChecked && event.buttons === 1) {
                    onClick({ x: position.x, y: position.y }, 'PRESS')
                }
                if (!isChecked && event.buttons === 2) {
                    console.log('flag')
                    onClick({ x: position.x, y: position.y }, 'FLAG')
                }
            }}
            // onMouseEnter={event => {
            //     event.preventDefault()

            // }}
        >
            {/* <div className={hintBorderClass(size)} /> */}
            {isChecked && value > 0 && value < 9 && value}
            {/* {value > 0 && value < 9 && value} */}
        </div>
    )
}

const wrapperClass = (size, isChecked, isFlag, isMine) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${size - 1};
    height: ${size - 1};
    margin: 1px 1px 0 0;
    background-color: ${isMine && isChecked
        ? '#F00'
        : isChecked
        ? '#1b1e2b'
        : isFlag
        ? '#f0f'
        : '#FFCC63'};
    box-sizing: border-box;
    cursor: pointer;

    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer */
    -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
    -webkit-user-select: none; /* Chrome, Safari, and Opera */
    -webkit-touch-callout: none; /* Disable Android and iOS callouts*/
`
const hintBorderClass = size => css`
    position: relative;
    /* transform: translate(-50% -50%); */

    width: ${size + 1}px;
    height: ${size + 1}px;

    &:hover {
        width: ${size * 3 + 1}px;
        height: ${size * 3 + 1}px;
        left: calc(-100% - 2px);
        top: calc(-100% - 2px);
        border: solid 1px #f0f;
    }
    box-sizing: border-box;
`

import { h, Fragment } from 'preact'
import { css } from 'emotion'
import { Cell } from './Cell'
import { handleCellClickType } from './GameContainer'
import { ColorGreyDark } from '../assets/variables'

export interface Props {
    text: string
    open: boolean
}

// Nice statless way to render our cells based on the array from the GameContainer
export const Splash = (props: Props) => {
    return props.open ? (
        <Fragment>
            <div className={wrapperClass()}></div>
            <div className={textClass()}>GAME OVER</div>
        </Fragment>
    ) : null
}

const wrapperClass = () => css`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;

    /* filter: blur(5px);
    -webkit-filter: blur(5px);
    -moz-filter: blur(5px);
    -o-filter: blur(5px);
    -ms-filter: blur(5px); */

    background-color: ${ColorGreyDark};
    opacity: 80%;
`
const textClass = () => css`
    z-index: 2;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50vh;
    left: 50vw;
`

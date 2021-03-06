import { h } from 'preact'
import GameContainer from './components/GameContainer'
import { GithubCorner } from './ui-components/GithubCorner'
import { ColorGreen } from './assets/variables'
import { css } from 'emotion'

export const App = () => {
    return (
        <div>
            <GithubCorner
                link="https://github.com/EnglishAW/game-of-life"
                fill={ColorGreen}
                logoColor="#292d3f"
            />
            <div
                className={css`
                    display: flex;
                    flex-flow: column;
                    justify-content: center;
                    align-items: center;
                `}
            >
                <h1>Minesweeper</h1>
                <GameContainer />
            </div>
        </div>
    )
}

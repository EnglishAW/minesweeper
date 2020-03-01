type PositionType = {
    x: number
    y: number
}
type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type Cell = {
    isChecked: boolean
    isFlag: boolean
    value: CellValue
}

type CellClickAction = 'PRESS' | 'CHECK' | 'FLAG' | 'CASCADE'

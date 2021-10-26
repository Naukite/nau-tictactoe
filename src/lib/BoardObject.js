function BoardObject(size) {
    this.size = size
    this.board = []

    this.init = () => {
        for (let i = 0; i < size; i++) {
            const row = []
            for (let j = 0; j < size; j++) {
                row.push(null)
            }
            this.board.push(row)
        }
    }

    this.getRow = (i) => {
        return this.board[i]
    }

    this.getValue = (i, j) => {
        return (this.board[i])[j]
    }

    this.setValue = (i, j, value) => {
        this.board[i][j] = value
        if (this.checkRow(i, value) === true) {
            return true;
        }
        if (this.checkColumn(j, value) === true) {
            return true;
        }
        if (this.checkMainDiagonal(i, j, value) === true) {
            return true;
        }
        if (this.checkReverseDiagonal(i, j, value) === true) {
            return true;
        }
        return false;
    }

    this.checkRow = (i, value) => {
        for (let j = 0; j < this.board.length; j++) {
            if (this.board[i][j] !== value) {
                return false;
            }
        }
        return true;
    }

    this.checkColumn = (j, value) => {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i][j] !== value) {
                return false;
            }
        }
        return true;
    }

    this.checkMainDiagonal = (rowIndex, colIndex, value) => {
        if (rowIndex !== colIndex) {
            return false;
        }
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i][i] !== value) {
                return false;
            }
        }
        return true;
    }

    this.checkReverseDiagonal = (rowIndex, colIndex, value) => {
        if ((rowIndex + colIndex) !== this.board.length - 1) {
            return false
        }
        for (let i = 0; i < this.board.length; i++) {
            let j = this.board.length - 1 - i;
            if (this.board[i][j] !== value) {
                return false;
            }
        }
        return true;
    }

    this.clone = () => {
        const newBoard = new BoardObject(this.size)
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                newBoard.setValue(i, j, this.board[i][j])
            }
        }
        return newBoard;
    }

    this.init();
    return this;
}

export default BoardObject
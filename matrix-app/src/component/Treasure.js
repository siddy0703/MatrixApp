import React from 'react';
import '../component/scss/base.scss'

class Treasure extends React.PureComponent {

    state = {
        noOfRows: 0,
        noOfCols: 0,
        exerciseStateReset: true,
        initialMatrix: false,
        showSubmitButton: false,
        matrix: [],
        showGridValueTable: false,
        treasureMatrix: [],
        toggleReset: false,
    }

    onChange = (event) => {
        const name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]: value
        })
    }


    resetMatrix = () => {
        this.setState({
            noOfRows: 0,
            noOfCols: 0,
            exerciseStateReset: true,
            initialMatrix: false,
            showSubmitButton: false,
            matrix: [],
            showGridValueTable: false,
            treasureMatrix: [],
            toggleReset: false,
        })
    }

    createValueTableMatrix = () => {
        this.createRawMatrix(1)
    }

    createRawMatrix = (val) => {
        const { noOfRows, noOfCols } = this.state;
        const newMatrix = [];
        for (let i = 0; i < noOfRows; i++) {
            const newRow = [];
            for (let j = 0; j < noOfCols; j++) {
                newRow.push({
                    row: i,
                    col: j,
                    val: 0,
                    treasure: ""
                });
            }
            newMatrix.push(newRow);
        }
        if(val === 0) {
            this.setState({
                exerciseStateReset: false,
                matrix: newMatrix,
                treasureMatrix: newMatrix,
                showSubmitButton: true,
                initialMatrix: true
            })
        }
        else if(val === 1) {

            this.setState({
                exerciseStateReset: false,
                initialMatrix: false,
                showSubmitButton: false,
                showGridValueTable: true,
                toggleReset: true,
            })
        }
    }


    handlePlotClick = (i, j) => {
        const matrix = JSON.parse(JSON.stringify(this.state.matrix));
        if (matrix[i][j].val === 'x') {
            matrix[i][j].val = 0
            this.setState({
                ...matrix,
                matrix: matrix
            })
            this.displayPlotClick(i,j)
        } else if (matrix[i][j].val === 0) {
            matrix[i][j].val = "x"
            this.setState({
                ...matrix,
                matrix: matrix
            })
            this.displayPlotClick(i,j)
        } else if (matrix[i][j]) {
            // if user clicked on a value plot then what needs to be happened ?
        }
    }

    displayPlotClick = (i, j) => {
        const matrix = JSON.parse(JSON.stringify(this.state.treasureMatrix));
        if (matrix[i][j].treasure === 'x') {
            this.removeValues(i, j);
        } else if (matrix[i][j].val === 0) {
            this.addValues(i, j);
        } else if (matrix[i][j]) {
            this.addValues(i, j);
        }
    }



    addValues = (m, n) => {
        const matrix = JSON.parse(JSON.stringify(this.state.treasureMatrix));
        const rowEnd = m === matrix.length - 1 ? m : m + 1,
            colEnd = n === matrix[0].length - 1 ? n : n + 1,
            rowStart = m === 0 ? m : m - 1,
            colStart = n === 0 ? n : n - 1;

        for (let i = rowStart; i <= rowEnd; i++) {
            for (let j = colStart; j <= colEnd; j++) {
                if (i === m && j === n) {
                    if(matrix[i][j].treasure === "" && matrix[i][j].val === 0) {
                        matrix[i][j].val = 0;
                        matrix[i][j].treasure = "x";
                    }
                    else if(matrix[i][j].treasure === "" && matrix[i][j].val != 0) {
                        matrix[i][j].treasure = "x";
                    }
                    else if(matrix[i][j].treasure === "x"){
                        matrix[i][j].val =  matrix[i][j].val + 1
                        matrix[i][j].treasure = 'x';
                    }
                }
                else if(matrix[i][j].treasure === "x"){
                    matrix[i][j].val = matrix[i][j].val + 1
                }
                else {
                    matrix[i][j].val = matrix[i][j].val ? matrix[i][j].val + 1 : 1;
                }
            }
        }

        this.setState({
            treasureMatrix: matrix
        })
    }

    removeValues = (m, n) => {
        const matrix = JSON.parse(JSON.stringify(this.state.treasureMatrix));
        const rowEnd = m === matrix.length - 1 ? m : m + 1,
            colEnd = n === matrix[0].length - 1 ? n : n + 1,
            rowStart = m === 0 ? m : m - 1,
            colStart = n === 0 ? n : n - 1;
        for (let i = rowStart; i <= rowEnd; i++) {
            for (let j = colStart; j <= colEnd; j++) {
                if (i === m && j === n) {
                    if(matrix[i][j].treasure === "x"){
                        matrix[i][j].treasure = "";
                    }
                }
                else {
                    matrix[i][j].val = matrix[i][j].val ? matrix[i][j].val - 1 : 1;
                }
            }
        }

        this.setState({
            treasureMatrix: matrix
        })
    }

    createRow = (row, rowIndex) => {
        const rowHeight = 200 / this.state.matrix.length;
        const colWidth = 200 / row.length;
        return (<div style={{ 'height': `${rowHeight}px` }} key={rowIndex} className='row'>
            {row.map((col, colIndex) => {
                return (<div onClick={() => this.handlePlotClick(rowIndex, colIndex)} key={`${rowIndex}_${colIndex}`}
                             className='plot-col' style={{ width: `${colWidth}px`, height: `${rowHeight}px` }}>
                    {col.val ? col.val : ''}
                </div>)
            })}
        </div>)
    }

    createFinalRowColumn = (row, rowIndex) => {
        const rowHeight = 200 / this.state.matrix.length;
        const colWidth = 200 / row.length;
        return (<div style={{ 'height': `${rowHeight}px` }} key={rowIndex} className='row'>
            {row.map((col, colIndex) => {
                return (<div className='plot-col' style={{ width: `${colWidth}px`, height: `${rowHeight}px` }}>
                    {col.treasure === "x"  ? col.treasure : col.val === 0 ? "" : col.val }
                </div>)
            })}
        </div>)
    }

    renderBody() {
        const { noOfRows, noOfCols, exerciseStateReset, matrix, initialMatrix, treasureMatrix, showSubmitButton, showGridValueTable, toggleReset } = this.state;
        return (
            <>
                <div className='container'>
                    {exerciseStateReset &&
                    <div>
                        <div className='row'>
                            <div className='col-sm-6'>
                                Enter number of Rows: <input name='noOfRows' type='number' value={noOfRows} onChange={this.onChange} />
                            </div>
                            <br/>
                            <div className='col-sm-6'>
                                Enter number of Columns:<input name='noOfCols' type='number' value={noOfCols} onChange={this.onChange} />
                            </div>
                        </div>
                        <div>
                            <div className='col-sm-4'>
                                <input type='button' name='createMatrix' value='Click to Create' onClick={()=> this.createRawMatrix(0)} />
                                <br/>
                                <br/>
                            </div>
                        </div>
                    </div>
                    }
                    <div style={{ height: '400px', padding: '40px' }}>
                        <div  className='row-flex'>
                            <div className='col-sm-10'>
                                {matrix.length > 0 && initialMatrix &&
                                matrix.map((row, rowIndex) => {
                                    return this.createRow(row, rowIndex);
                                })
                                }
                            </div>
                        </div>
                        {matrix.length > 0 && showSubmitButton &&
                        <div className= 'submit'>
                            <input type='button' name='submit' value='submit' onClick={this.createValueTableMatrix}/>
                        </div>}

                        {treasureMatrix.length > 0 && showGridValueTable &&
                        <div style={{ height: '200px', padding: '40px' }}>
                            <div  className='row-flex'>
                                <div className='col-sm-10'>
                                    {
                                        treasureMatrix.map((row, rowIndex) => {
                                            return this.createFinalRowColumn(row, rowIndex);
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        }

                        {toggleReset &&
                        <input type='button' name='resetMatrix' value='Click to Reset' onClick={this.resetMatrix}
                        />
                        }

                    </div>
                </div>
            </>
        )
    }

    render() {
        return (this.renderBody())
    }
}

export default Treasure;
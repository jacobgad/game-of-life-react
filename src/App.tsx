import { useEffect, useState } from 'react';

interface GridSize {
	cols: number;
	rows: number;
}

const neighbours = [
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[0, -1],
	[0, 1],
	[1, -1],
	[1, 0],
	[1, 1],
];

function generateGrid(gridSize: GridSize) {
	let grid: number[][] = [];
	for (let i = 0; i < gridSize.rows; i++) {
		grid.push(Array.from(Array(gridSize.cols), () => 0));
	}
	return grid;
}

function generateRandomGrid(gridSize: GridSize, randPopDenc: number) {
	let grid: number[][] = [];
	for (let i = 0; i < gridSize.rows; i++) {
		grid.push(Array.from(Array(gridSize.cols), () => (Math.random() < randPopDenc / 100 ? 1 : 0)));
	}
	return grid;
}

function copyGrid(grid: number[][]) {
	return grid.map((arr) => arr.slice());
}

function getNeighbours(grid: number[][], i: number, j: number) {
	let numNeighbours = 0;
	neighbours.map((n) => {
		const realI = i + n[1];
		const realJ = j + n[0];
		if (realI >= 0 && realI < grid.length && realJ >= 0 && realJ < grid[0].length)
			numNeighbours += grid[realI][realJ];
	});
	return numNeighbours;
}

function getNextGen(grid: number[][]) {
	let newGrid = copyGrid(grid);
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].length; j++) {
			const neighbours = getNeighbours(grid, i, j);
			if (neighbours < 2 || neighbours > 3) newGrid[i][j] = 0;
			if (neighbours === 3) newGrid[i][j] = 1;
		}
	}
	return newGrid;
}

export default function App() {
	const [gridSize, setGridSize] = useState<GridSize>({ cols: 40, rows: 20 });
	const [grid, setGrid] = useState(generateGrid(gridSize));
	const [running, setRunning] = useState(false);
	const [gen, setGen] = useState(0);
	const [speed, setSpeed] = useState(50);
	const [randPopDenc, setRandPopDenc] = useState(50);

	function handleToggleTile(i: number, j: number) {
		let newGrid = copyGrid(grid);
		newGrid[i][j] = newGrid[i][j] ? 0 : 1;
		setGrid(newGrid);
	}

	function handleClear() {
		setGrid(generateGrid(gridSize));
		setGen(0);
	}

	useEffect(() => {
		handleClear();
	}, [gridSize]);

	useEffect(() => {
		if (!running) return;
		const timer = setInterval(() => {
			setGrid((current) => {
				const nextGen = getNextGen(current);
				if (JSON.stringify(current) === JSON.stringify(nextGen)) {
					setRunning(false);
				}
				return getNextGen(current);
			});
			setGen((gen) => gen + 1);
		}, 1000 - speed * 10);

		return () => clearInterval(timer);
	}, [running, speed]);

	return (
		<div style={{ display: 'grid', justifyContent: 'center', margin: '1rem' }}>
			<h1 style={{ textAlign: 'center' }}>Game of Life</h1>
			<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
				<button
					style={{ width: '6rem' }}
					className='btn btn-success'
					onClick={() => setRunning(!running)}
				>
					{running ? 'Stop' : 'Start'}
				</button>
				<button
					style={{ width: '6rem' }}
					className='btn btn-danger'
					onClick={handleClear}
					disabled={running}
				>
					Clear
				</button>
				<button
					style={{ width: '6rem' }}
					className='btn btn-primary'
					onClick={() => {
						handleClear();
						setGrid(generateRandomGrid(gridSize, randPopDenc));
					}}
					disabled={running}
				>
					Random
				</button>
			</div>
			<div
				className='container'
				style={{
					marginTop: '1rem',
					marginBottom: '1rem',
				}}
			>
				<div className='row'>
					<div className='col-12 col-md-2'>
						<h4>Generation: {gen}</h4>
					</div>
					<div className='col-12 col-md-4'>
						<div className='input-group'>
							<span className='input-group-text'>Width</span>
							<input
								value={gridSize.cols ? gridSize.cols : ''}
								onChange={(e) => setGridSize({ ...gridSize, cols: +e.target.value })}
								type='number'
								className='form-control'
								placeholder='Width'
								disabled={running}
							/>
							<span className='input-group-text'>Height</span>
							<input
								value={gridSize.rows ? gridSize.rows : ''}
								onChange={(e) => setGridSize({ ...gridSize, rows: +e.target.value })}
								type='number'
								className='form-control'
								placeholder='Height'
								disabled={running}
							/>
						</div>
					</div>
					<div className='col-6 col-md-3'>
						<label htmlFor='speed' className='form-label'>
							Speed: {speed}
						</label>
						<input
							type='range'
							className='form-range'
							min='0'
							max='100'
							id='speed'
							value={speed}
							onChange={(e) => setSpeed(parseInt(e.target.value))}
						/>
					</div>
					<div className='col-6 col-md-3'>
						<label htmlFor='dencity' className='form-label'>
							Population Dencity: {randPopDenc}
						</label>
						<input
							type='range'
							className='form-range'
							min='0'
							max='100'
							id='dencity'
							value={randPopDenc}
							onChange={(e) => setRandPopDenc(parseInt(e.target.value))}
							disabled={running}
						/>
					</div>
				</div>
			</div>
			<div
				style={{
					display: 'grid',
					justifyContent: 'center',
					gridTemplateColumns: `repeat(${gridSize.cols}, calc(95vw / ${gridSize.cols}))`,
				}}
			>
				{grid.map((row, i) =>
					row.map((col, j) => (
						<div
							key={`${i},${j}`}
							onClick={() => handleToggleTile(i, j)}
							style={{
								width: `calc(95vw / ${gridSize.cols})`,
								aspectRatio: '1',
								borderTop: '1px solid black',
								borderLeft: '1px solid black',
								borderRight: j === gridSize.cols - 1 ? '1px solid black' : undefined,
								borderBottom: i === gridSize.rows - 1 ? '1px solid black' : undefined,
								background: col ? 'lightblue' : undefined,
							}}
						/>
					))
				)}
			</div>
		</div>
	);
}

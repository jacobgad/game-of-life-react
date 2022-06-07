import { useCallback, useEffect, useRef, useState } from 'react';
import './app.css';

const numCols = 40;
const numRows = 20;

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

function generateGrid() {
	let grid: number[][] = [];
	for (let i = 0; i < numRows; i++) {
		grid.push(Array.from(Array(numCols), () => 0));
	}
	return grid;
}

function generateRandomGrid() {
	let grid: number[][] = [];
	for (let i = 0; i < numRows; i++) {
		grid.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
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
		if (realI >= 0 && realI < numRows && realJ >= 0 && realJ < numCols)
			numNeighbours += grid[realI][realJ];
	});
	console.log(numNeighbours);
	return numNeighbours;
}

function getNextGen(grid: number[][]) {
	let newGrid = copyGrid(grid);
	for (let i = 0; i < numRows; i++) {
		for (let j = 0; j < numCols; j++) {
			const neighbours = getNeighbours(grid, i, j);
			if (neighbours < 2 || neighbours > 3) newGrid[i][j] = 0;
			if (neighbours === 3) newGrid[i][j] = 1;
		}
	}
	return newGrid;
}

export default function App() {
	const [grid, setGrid] = useState(generateGrid());
	const [running, setRunning] = useState(false);
	const [gen, setGen] = useState(0);

	const runningRef = useRef(running);
	runningRef.current = running;

	function handleToggleTile(i: number, j: number) {
		let newGrid = copyGrid(grid);
		newGrid[i][j] = newGrid[i][j] ? 0 : 1;
		setGrid(newGrid);
	}

	function handleToggleRunning() {
		setRunning(!running);
		if (!running) {
			runningRef.current = true;
			runSimulation();
		}
	}

	function handleClear() {
		setGrid(generateGrid());
		setGen(0);
	}

	const runSimulation = useCallback(() => {
		if (!runningRef.current) return;
		setGrid((current) => {
			const nextGen = getNextGen(current);
			if (JSON.stringify(current) === JSON.stringify(nextGen)) {
				setRunning(false);
			}
			return getNextGen(current);
		});
		setGen((gen) => gen + 1);
		setTimeout(runSimulation, 200);
	}, []);

	return (
		<div style={{ marginLeft: '2rem', marginRight: '2rem' }}>
			<h1 style={{ textAlign: 'center' }}>Game of Life</h1>
			<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
				<button style={{ width: '5rem' }} onClick={handleToggleRunning}>
					{running ? 'Stop' : 'Start'}
				</button>
				<button style={{ width: '5rem' }} onClick={handleClear} disabled={runningRef.current}>
					Clear
				</button>
				<button
					style={{ width: '5rem' }}
					onClick={() => {
						handleClear();
						setGrid(generateRandomGrid());
					}}
					disabled={runningRef.current}
				>
					Random
				</button>
			</div>
			<h2 style={{ marginTop: 0 }}>Generation: {gen}</h2>
			<div
				style={{
					display: 'grid',
					justifyContent: 'center',
					gridTemplateColumns: `repeat(${numCols}, 2rem)`,
				}}
			>
				{grid.map((row, i) =>
					row.map((col, j) => (
						<div
							key={`${i},${j}`}
							onClick={() => handleToggleTile(i, j)}
							style={{
								width: '2rem',
								height: '2rem',
								borderTop: '2px solid black',
								borderLeft: '2px solid black',
								borderRight: j === numCols - 1 ? '2px solid black' : undefined,
								borderBottom: i === numRows - 1 ? '2px solid black' : undefined,
								background: col ? 'lightblue' : undefined,
							}}
						/>
					))
				)}
			</div>
		</div>
	);
}

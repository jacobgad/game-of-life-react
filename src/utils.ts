export interface GridSize {
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

export function generateGrid(gridSize: GridSize) {
	let grid: number[][] = [];
	for (let i = 0; i < gridSize.rows; i++) {
		grid.push(Array.from(Array(gridSize.cols), () => 0));
	}
	return grid;
}

export function generateRandomGrid(gridSize: GridSize, randPopDenc: number) {
	let grid: number[][] = [];
	for (let i = 0; i < gridSize.rows; i++) {
		grid.push(Array.from(Array(gridSize.cols), () => (Math.random() < randPopDenc / 100 ? 1 : 0)));
	}
	return grid;
}

export function copyGrid(grid: number[][]) {
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

export function getNextGen(grid: number[][]) {
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

import { useEffect, useState } from 'react';
import Button from './components/Button';
import CheckboxInput from './components/CheckboxInput';
import Grid from './components/Grid';
import RangeInput from './components/RangeInput';
import Input from './components/TextInput';
import { copyGrid, generateGrid, generateRandomGrid, getNextGen, GridSize } from './utils';

export default function App() {
	const [gridSize, setGridSize] = useState<GridSize>({ cols: 40, rows: 20 });
	const [grid, setGrid] = useState(generateGrid(gridSize));
	const [running, setRunning] = useState(false);
	const [gen, setGen] = useState(0);
	const [speed, setSpeed] = useState(50);
	const [randPopDenc, setRandPopDenc] = useState(50);
	const [showGridLines, setShowGridLines] = useState(true);

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
		<>
			<div className='grid justify-center mx-[2.5vw] mt-4 mb-8 gap-4'>
				<h1 className='text-center text-3xl font-semibold'>Game of Life</h1>

				<div className='flex justify-center gap-4'>
					<Button color={running ? 'yellow' : 'green'} onClick={() => setRunning(!running)}>
						{running ? 'Stop' : 'Start'}
					</Button>
					<Button color='red' onClick={handleClear} disabled={running}>
						Clear
					</Button>
					<Button
						color='blue'
						onClick={() => {
							handleClear();
							setGrid(generateRandomGrid(gridSize, randPopDenc));
						}}
						disabled={running}
					>
						Random
					</Button>
				</div>

				<div className='grid xl:flex xl:justify-evenly gap-4 xl:gap-8 xl:w-[90vw]'>
					<div className='flex justify-between items-center gap-4 w-full'>
						<p className='font-semibold text-lg'>Generation: {gen}</p>
						<CheckboxInput
							label='Grid Lines'
							checked={showGridLines}
							onChange={(e) => setShowGridLines(e.target.checked)}
							id='gridLines'
						/>
					</div>

					<div className='flex justify-between items-center gap-4 w-full'>
						<Input
							label='Width'
							value={gridSize.cols ? gridSize.cols : ''}
							onChange={(e) => setGridSize({ ...gridSize, cols: +e.target.value })}
							type='number'
							id='width'
							placeholder='Width'
							disabled={running}
						/>
						<Input
							label='Height'
							value={gridSize.rows ? gridSize.rows : ''}
							onChange={(e) => setGridSize({ ...gridSize, rows: +e.target.value })}
							type='number'
							id='height'
							className='px-3 w-full outline-none'
							placeholder='Height'
							disabled={running}
						/>
					</div>

					<div className='flex justify-between items-center gap-8 w-full'>
						<RangeInput
							label={`Speed: ${speed}`}
							min='0'
							max='100'
							id='speed'
							value={speed}
							onChange={(e) => setSpeed(parseInt(e.target.value))}
						/>
						<RangeInput
							label={`Dencity: ${randPopDenc}`}
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

			<Grid grid={grid} onClick={handleToggleTile} showGridLines={showGridLines} />
		</>
	);
}

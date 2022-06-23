interface Props {
	grid: number[][];
	showGridLines: boolean;
	onClick: (i: number, j: number) => void;
}

export default function Grid({ grid, showGridLines, onClick }: Props) {
	return (
		<div
			className={`mx-[2.5vw] mb-6 border-t-[1px] border-l-[1px] ${
				!showGridLines && 'border-r-[1px] border-b-[1px]'
			}`}
		>
			{grid.map((row, i) => (
				<div className='flex'>
					{row.map((cell, j) => (
						<div
							key={`${i},${j}`}
							onClick={() => onClick(i, j)}
							className={`w-full aspect-square  
            ${cell && 'bg-blue-300'} 
            ${showGridLines && 'border-b-[1px] border-r-[1px]'}`}
						/>
					))}
				</div>
			))}
		</div>
	);
}

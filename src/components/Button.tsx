const colorClasses = {
	blue: 'bg-blue-600 hover:bg-blue-700',
	green: 'bg-green-600 hover:bg-green-700',
	yellow: 'bg-yellow-600 hover:bg-yellow-700',
	red: 'bg-red-600 hover:bg-red-700',
};

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color: keyof typeof colorClasses;
}

export default function Button({ children, color, ...rest }: Props) {
	return (
		<button
			{...rest}
			className={`${colorClasses[color]} text-white font-bold py-2 px-4 rounded w-24 disabled:opacity-50 disabled:cursor-not-allowed`}
		>
			{children}
		</button>
	);
}

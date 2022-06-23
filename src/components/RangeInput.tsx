interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
}

export default function RangeInput({ label, ...rest }: Props) {
	return (
		<div className='w-full grid gap-2'>
			<label htmlFor='speed'>{label}</label>
			<input {...rest} type='range' className='disabled:opacity-50 disabled:cursor-not-allowed' />
		</div>
	);
}

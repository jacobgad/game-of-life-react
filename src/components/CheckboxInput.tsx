interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
}

export default function ({ label, ...rest }: Props) {
	return (
		<div className='flex items-center gap-2'>
			<input {...rest} type='checkbox' />
			<label htmlFor='gridLines'>{label}</label>
		</div>
	);
}

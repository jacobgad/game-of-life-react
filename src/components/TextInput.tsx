interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
}

export default function Input({ label, ...rest }: Props) {
	return (
		<div className='flex border-2 rounded-md overflow-hidden'>
			<label className='bg-gray-100 border-r-2 p-2' htmlFor='height'>
				{label}
			</label>
			<input {...rest} className='px-3 w-full outline-none disabled:bg-gray-100' />
		</div>
	);
}

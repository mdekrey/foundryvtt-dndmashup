export function ImageEditor({
	src,
	title,
	className,
}: {
	src: string | null;
	title: string | null;
	className?: string;
}) {
	return (
		<img
			src={src ?? ''}
			data-edit="img"
			title={title ?? ''}
			className={className ?? 'w-24 h-24 border-2 border-black p-px'}
		/>
	);
}

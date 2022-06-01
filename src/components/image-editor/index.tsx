import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathName, getFieldValue } from 'src/core/path-typings';
import { useSetField } from '../form-input/hooks/useSetField';

export function ImageEditor<TDocument extends AnyDocument>({
	document,
	field,
	title,
	className,
}: {
	document: TDocument;
	field: PathName<SourceDataOf<TDocument>, string>;
	title: string | null;
	className?: string;
}) {
	const setField = useSetField(document, field);
	const src = getFieldValue(document.data._source, field);

	return (
		<img
			src={src ?? ''}
			onClick={showFilePicker}
			title={title ?? ''}
			className={className ?? 'w-24 h-24 border-2 border-black p-px'}
		/>
	);

	function showFilePicker(ev: React.MouseEvent<HTMLImageElement>) {
		const fp = new FilePicker({
			type: 'image',
			current: src,
			callback: (path) => {
				setField(path);
			},
			top: ev.currentTarget.clientTop + 40,
			left: ev.currentTarget.clientLeft + 10,
		});
		return fp.browse(src);
	}
}

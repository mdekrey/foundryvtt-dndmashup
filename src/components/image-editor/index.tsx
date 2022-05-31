import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathNameNoArrays, getFieldValue } from 'src/core/path-typings';

export function ImageEditor<TDocument extends AnyDocument>({
	document,
	field,
	title,
	className,
}: {
	document: TDocument;
	field: PathNameNoArrays<SourceDataOf<TDocument>, string>;
	title: string | null;
	className?: string;
}) {
	const src = getFieldValue(document.data._source, field);
	return (
		<img
			src={src ?? ''}
			data-edit={field}
			title={title ?? ''}
			className={className ?? 'w-24 h-24 border-2 border-black p-px'}
		/>
	);
}

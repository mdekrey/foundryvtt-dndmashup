import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { getFieldValue, PathNameNoArrays } from 'src/core/path-typings';

export function RichText<TDocument extends AnyDocument>({
	document,
	field,
}: {
	document: TDocument;
	field: PathNameNoArrays<SourceDataOf<TDocument>, string>;
}) {
	const html = getFieldValue(document.data._source, field);

	const enriched = TextEditor.enrichHTML(html ?? '', {
		/* TODO - parameters: secrets: owner, documents, rollData */
	});

	const isEditor = true; // TODO - editable?

	return (
		<>
			<div className="editor">
				{isEditor ? (
					<div className="editor-content" data-edit={field} dangerouslySetInnerHTML={{ __html: enriched }} />
				) : null}
				<a className="editor-edit">
					<i className="fas fa-edit"></i>
				</a>
			</div>
		</>
	);
}

/* {{editor content=actorData.details.biography target="data.details.biography" button=true owner=owner editable=editable rollData=rollData}}
 */

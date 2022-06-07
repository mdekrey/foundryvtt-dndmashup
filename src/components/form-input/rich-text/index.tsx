import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { getFieldValue, PathName } from 'src/core/path-typings';

export function RichText<TDocument extends AnyDocument>({
	document,
	field,
	rollData,
}: {
	document: TDocument;
	field: PathName<SourceDataOf<TDocument>, string>;
	rollData?: object | (() => object);
}) {
	const html = getFieldValue(document.data._source, field);

	const enriched = TextEditor.enrichHTML(html ?? '', {
		rollData,
		/* TODO - parameters: secrets: owner, documents */
	});

	const isEditor = document.isOwner;

	// TODO - use TextEditor as in foundry.js to activateEditor

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

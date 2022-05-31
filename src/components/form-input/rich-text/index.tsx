import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { getFieldValue, PathName } from 'src/core/path-typings';
import { useDocument } from '../../sheet/framework';

export function RichText<TDocument extends AnyDocument>({
	field,
}: JSX.IntrinsicElements['input'] & { field: PathName<SourceDataOf<TDocument>, string> }) {
	const document = useDocument<TDocument>();

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

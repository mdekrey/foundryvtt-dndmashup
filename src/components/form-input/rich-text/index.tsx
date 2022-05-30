import { AnyDocument } from 'src/core/foundry';
import { PathName } from 'src/core/path-typings';
import { useDocument } from '../../sheet/framework';

type SafeDocumentData<TDocument extends AnyDocument> = Pick<TDocument['data'], 'name' | 'data'>;

export function RichText<TDocument extends AnyDocument>({
	field,
}: JSX.IntrinsicElements['input'] & { field: PathName<SafeDocumentData<TDocument>, string> }) {
	const document = useDocument<TDocument>();

	const html: string = field.split('.').reduce((prev, f) => prev[f], document.data);

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

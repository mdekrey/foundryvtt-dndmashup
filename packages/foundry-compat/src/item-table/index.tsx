import classNames from 'classnames';
import { IconButton, Table } from '@foundryvtt-dndmashup/components';
import { BaseDocument } from '../interfaces';
import { useApplicationDispatcher } from '../components';

type ItemTableDocument = BaseDocument & {
	displayName: string | null;
	img: string | null;
	showEditDialog(): void;
};

export function ItemTable<T extends ItemTableDocument>({
	title,
	items,
	header,
	body,
	className,
}: {
	title: string;
	items: T[];
	header?: () => React.ReactNode;
	body?: (item: T) => React.ReactNode;
	className?: string;
}) {
	return (
		<Table className={className}>
			<Table.HeaderRow>
				<th className="w-10" />
				<th className="pl-1 text-left">{title}</th>
				{header && header()}
				<th className="w-0" />
			</Table.HeaderRow>
			{items.map((item) => (
				<ItemTableRow key={item.id} item={item} body={body} />
			))}
		</Table>
	);
}

function ItemTableRow<T extends ItemTableDocument>({
	item,
	body,
}: {
	item: T;
	body: undefined | ((item: T) => React.ReactNode);
}) {
	const apps = useApplicationDispatcher();
	return (
		<Table.Body>
			<tr className="border-b-2 border-transparent">
				<td className="w-10 h-10 px-1" draggable={true} onDragStart={handleDragStart}>
					<button type="button" className="block w-full h-full" onClick={edit}>
						{item.img ? <img src={item.img} alt="" className="w-8 h-8 inline-block" /> : null}
					</button>
				</td>
				<td className="pl-1" draggable={true} onDragStart={handleDragStart}>
					<button type="button" className="block w-full h-full text-left" onClick={edit}>
						{item.displayName}
					</button>
				</td>
				{body && body(item)}
				<td
					className={classNames('text-right', {
						'w-6': !item.isOwner,
						'w-12': item.isOwner,
					})}>
					<IconButton title="Edit" onClick={edit} iconClassName="fas fa-edit" />
					{item.isOwner ? <IconButton title="Delete" onClick={remove} iconClassName="fas fa-trash" /> : null}
				</td>
			</tr>
		</Table.Body>
	);

	function edit() {
		item.showEditDialog();
	}
	async function remove() {
		const result = await apps
			.launchApplication('dialog', {
				title: 'Are you sure...?',
				content: `Are you sure you want to delete ${item.name}? This cannot be undone.`,
			})
			.then(({ result }) => result)
			.catch(() => false);
		if (result) item.delete();
	}

	function handleDragStart(ev: React.DragEvent) {
		ev.dataTransfer.setData(
			'text/plain',
			JSON.stringify({
				type: 'Item',
				uuid: item.uuid,
			})
		);
	}
}

import classNames from 'classnames';
import { IconButton, Table } from '@foundryvtt-dndmashup/components';
import { BaseDocument } from '../interfaces';

type ItemTableDocument = BaseDocument & {
	img: string | null;
	showEditDialog(): void;
};

export function ItemTable<T extends ItemTableDocument, ChildProps extends Record<string, unknown>>({
	title,
	items,
	passedProps,
	header: TableHeader,
	body,
	className,
}: {
	title: string;
	items: T[];
	passedProps?: ChildProps;
	header?: React.FC<ChildProps>;
	body?: React.FC<{ item: T } & ChildProps>;
	className?: string;
}) {
	return (
		<Table className={className}>
			<Table.HeaderRow>
				<th className="w-10" />
				<th className="pl-1 text-left">{title}</th>
				{TableHeader && <TableHeader {...(passedProps as any)} />}
				<th className="w-0" />
			</Table.HeaderRow>
			{items.map((item) => (
				<ItemTableRow key={item.id} item={item} passedProps={(passedProps ?? {}) as any} body={body} />
			))}
		</Table>
	);
}

function ItemTableRow<T extends ItemTableDocument, ChildProps extends Record<string, unknown>>({
	item,
	passedProps,
	body: TableBody,
}: {
	item: T;
	passedProps: ChildProps;
	body: undefined | React.FC<{ item: T } & ChildProps>;
}) {
	return (
		<Table.Body>
			<tr className="border-b-2 border-transparent">
				<td className="w-10 h-10 px-1">
					{item.img ? <img src={item.img} alt="" className="w-8 h-8 inline-block" /> : null}
				</td>
				<td className="pl-1">{item.name}</td>
				{TableBody && <TableBody item={item} {...passedProps} />}
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
	function remove() {
		item.delete();
	}
}

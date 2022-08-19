import classNames from 'classnames';
import { useRef } from 'react';
import { IconButton, Table } from '@foundryvtt-dndmashup/components';
import { SimpleDocument } from '../interfaces';

export function ItemTable<T extends SimpleDocument, ChildProps extends Record<string, unknown>>({
	title,
	items,
	passedProps,
	header: TableHeader,
	body,
	detail,
	addedCellCount,
	className,
}: {
	title: string;
	items: T[];
	passedProps?: ChildProps;
	header?: React.FC<ChildProps>;
	body?: React.FC<{ item: T } & ChildProps>;
	detail?: React.FC<{ item: T } & ChildProps>;
	addedCellCount?: number;
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
				<ItemTableRow
					key={item.id}
					item={item}
					passedProps={(passedProps ?? {}) as any}
					body={body}
					detail={detail}
					addedCellCount={addedCellCount}
				/>
			))}
		</Table>
	);
}

function ItemTableRow<T extends SimpleDocument, ChildProps extends Record<string, unknown>>({
	item,
	passedProps,
	body: TableBody,
	detail: TableRowDetail,
	addedCellCount,
}: {
	item: T;
	passedProps: ChildProps;
	body: undefined | React.FC<{ item: T } & ChildProps>;
	detail: undefined | React.FC<{ item: T } & ChildProps>;
	addedCellCount: undefined | number;
}) {
	const detailRef = useRef<HTMLDivElement | null>(null);

	return (
		<Table.Body>
			<tr className="border-b-2 border-transparent">
				<td className="w-10 h-10 px-1">
					{item.img ? <img src={item.img} alt="" className="w-8 h-8 inline-block" /> : null}
				</td>
				<td className="pl-1">
					{TableRowDetail ? (
						<button type="button" className="focus:ring-blue-bright-600 focus:ring-1" onClick={toggle}>
							{item.name}
						</button>
					) : (
						item.name
					)}
				</td>
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
			{TableRowDetail ? (
				<tr>
					<td></td>
					<td colSpan={1 + (addedCellCount ?? 0)}>
						<div ref={detailRef} className="overflow-hidden max-h-0 transition-all duration-300">
							<TableRowDetail item={item} {...passedProps} />
						</div>
					</td>
					<td></td>
				</tr>
			) : null}
		</Table.Body>
	);

	function edit() {
		item.showEditDialog();
	}
	function remove() {
		item.delete();
	}
	function toggle() {
		if (!detailRef.current) return;
		if (detailRef.current.style.maxHeight) detailRef.current.style.maxHeight = '';
		else detailRef.current.style.maxHeight = `${detailRef.current.scrollHeight}px`;
	}
}

import classNames from 'classnames';
import { useRef } from 'react';
import { IconButton } from 'src/components/icon-button';
import { MashupItemBase } from 'src/module/item/mashup-item';

export function ItemTable<T extends MashupItemBase, ChildProps extends Record<string, unknown>>({
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
		<table className={classNames('w-full border-collapse', className)}>
			<thead className="bg-theme text-white">
				<tr>
					<th className="py-1 w-10" />
					<th className="py-1 pl-1 text-left">{title} Name</th>
					{TableHeader && <TableHeader {...(passedProps as any)} />}
					<th className="py-1 w-0" />
				</tr>
			</thead>
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
		</table>
	);
}

function ItemTableRow<T extends MashupItemBase, ChildProps extends Record<string, unknown>>({
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
		<tbody className="even:bg-gradient-to-r from-transparent to-white odd:bg-transparent">
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
		</tbody>
	);

	function edit() {
		item.sheet?.render(true, { focus: true });
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

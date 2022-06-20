import classNames from 'classnames';
import { IconButton } from 'src/components/icon-button';
import { MashupItemBase } from 'src/module/item/mashup-item';

export function ItemTable<T extends MashupItemBase>({
	title,
	items,
	header: TableHeader,
	body: TableBody,
	className,
}: {
	title: string;
	items: T[];
	header?: React.FC;
	body?: React.FC<{ item: T }>;
	className?: string;
}) {
	return (
		<table className={classNames('w-full border-collapse', className)}>
			<thead className="bg-theme text-white">
				<tr>
					<th className="py-1 w-10" />
					<th className="py-1 pl-1 text-left">{title} Name</th>
					{TableHeader && <TableHeader />}
					<th className="py-1 w-16" />
				</tr>
			</thead>
			<tbody>
				{items.map((item) => {
					return (
						<tr
							key={item.id}
							className={classNames(
								'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
								'border-b-2 border-transparent'
							)}>
							<td className="w-10 h-10 px-1">
								{item.img ? <img src={item.img} alt="" className="w-8 h-8 inline-block" /> : null}
							</td>
							<td className="pl-1">{item.name}</td>
							{TableBody && <TableBody item={item} />}
							<td className="text-right w-16">
								<IconButton title="Edit" onClick={edit(item)} iconClassName="fas fa-edit" />
								{item.isOwner ? (
									<IconButton title="Delete" onClick={remove(item)} iconClassName="fas fa-trash" />
								) : null}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);

	function edit(item: T) {
		return () => {
			item.sheet?.render(true, { focus: true });
		};
	}
	function remove(item: T) {
		return () => {
			item.delete();
		};
	}
}

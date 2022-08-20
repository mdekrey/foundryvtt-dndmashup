import { ActorDocument } from '../../documentType';
import { isPower, CommonAction } from '../../actions';
import { Table } from '@foundryvtt-dndmashup/components';
import { PowerDocument } from '../../../item/subtypes/power/dataSourceData';
import { Row } from './Row';

export function PowerTable({
	actor,
	powers,
	className,
	title,
}: {
	actor: ActorDocument;
	powers: (PowerDocument | CommonAction)[];
	className?: string;
	title: string;
}) {
	return (
		<Table className={className}>
			<Table.HeaderRow>
				<th className="w-10" />
				<th className="pl-1 text-left">{title}</th>
				<th></th>
				<th className="w-0" />
			</Table.HeaderRow>
			{powers.map((power) => (
				<Row key={isPower(power) ? power.id : power.name} power={power} actor={actor} />
			))}
		</Table>
	);
}

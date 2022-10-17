import { ActorDocument } from '../../documentType';
import { isPower, CommonAction } from '../../actions';
import { AppButton, Table } from '@foundryvtt-dndmashup/components';
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
				<th className="pl-12 text-left">{title}</th>
				<th></th>
				<th className="w-0">
					<AppButton className="border-0" onClick={() => actor.importChildItem('power')}>
						New
					</AppButton>
				</th>
			</Table.HeaderRow>
			{powers.map((power) => (
				<Row key={isPower(power) ? power.id : power.name} power={power} actor={actor} />
			))}
		</Table>
	);
}

import { Table as Original } from './Table';
import { TableBody } from './TableBody';
import { TableHeaderRow } from './TableHeaderRow';

export const Table = Object.assign(Original, {
	Body: TableBody,
	HeaderRow: TableHeaderRow,
});

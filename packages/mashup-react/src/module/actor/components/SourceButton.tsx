import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';

export function SourceButton({ source }: { source: SimpleDocument }) {
	return (
		<button type="button" className="w-full text-left" onClick={() => source.showEditDialog()}>
			{source.img ? <img src={source.img} alt="" className="w-8 h-8 inline-block mr-2" /> : null}
			{source.name}
		</button>
	);
}

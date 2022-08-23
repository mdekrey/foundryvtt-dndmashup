import { applicationRegistry } from '@foundryvtt-dndmashup/foundry-compat';

applicationRegistry.dialog = async ({ content, title }, resolve, reject) => ({
	content: (
		<div className="flex flex-col h-full p-2 gap-2">
			<p className="flex-1">{content}</p>
			<div className="grid grid-cols-2 gap-2">
				<button type="button" className="border border-black h-8" onClick={() => resolve(true)}>
					Yes
				</button>
				<button type="button" className="border border-black h-8" onClick={() => resolve(false)}>
					No
				</button>
			</div>
		</div>
	),
	title: title,
	options: {
		resizable: false,
	},
});

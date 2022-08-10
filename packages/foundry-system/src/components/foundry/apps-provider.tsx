import { SimpleApplication } from '@foundryvtt-dndmashup/foundry-compat';
import {
	ApplicationDispatcherContextProvider,
	ApplicationDispatcherContext,
	applicationRegistry,
	MashupApplicationResultType,
} from '@foundryvtt-dndmashup/mashup-react';
import { MashupApplicationType } from '@foundryvtt-dndmashup/mashup-react';
import { noop } from 'lodash/fp';
import { ReactApplicationMixin } from '../../core/react/react-application-mixin';

export const applicationDispatcher: ApplicationDispatcherContext = {
	async launchApplication<T extends MashupApplicationType>(
		messageType: T,
		param: MashupApplication[T]
	): Promise<{ dialog: SimpleApplication; result: Promise<MashupApplicationResultType<T>> }> {
		let tempResolve: ((value: MashupApplicationResultType<T>) => void) | undefined = undefined;
		let tempReject: ((reason?: any) => void) | undefined = undefined;

		const resultPromise = new Promise<MashupApplicationResultType<T>>((resolve, reject) => {
			tempResolve = resolve;
			tempReject = reject;
		});
		if (!tempResolve || !tempReject) throw new Error(`Promise didn't provide callbacks.`);

		const { content, title, options } = await applicationRegistry[messageType](param, tempResolve, tempReject);
		const dialog = new JsxDialog(content, { title, close: () => tempReject?.() }, options);
		dialog.render(true);

		resultPromise
			.finally(() => {
				dialog.close();
			})
			// eats the error from the console without actually losing the error for anything looking at the result
			.catch(noop);

		return {
			dialog,
			result: resultPromise,
		};
	},
};

export function WrapApplicationDispatcher({ children }: { children?: React.ReactNode }) {
	return (
		<ApplicationDispatcherContextProvider value={applicationDispatcher}>
			{children}
		</ApplicationDispatcherContextProvider>
	);
}

class JsxDialog extends ReactApplicationMixin(Dialog) {
	constructor(
		private jsx: JSX.Element,
		data: Omit<Dialog.Data, 'buttons' | 'default' | 'content'>,
		options?: Partial<DialogOptions>
	) {
		super({ ...data, content: '', buttons: {}, default: '' }, options);
	}

	protected override _getJsx(): JSX.Element {
		return this.jsx;
	}
}

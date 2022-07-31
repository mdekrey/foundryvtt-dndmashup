import { SimpleApplication } from '@foundryvtt-dndmashup/foundry-compat';
import {
	ApplicationDispatcherContextProvider,
	ApplicationDispatcherContext,
	applicationRegistry,
	MashupApplicationResultType,
} from '@foundryvtt-dndmashup/mashup-react';
import { MashupApplicationType } from '@foundryvtt-dndmashup/mashup-react';
import { ReactApplicationMixin } from '../../core/react';

const applicationDispatcherContextValue: ApplicationDispatcherContext = {
	launchApplication<T extends MashupApplicationType>(
		messageType: T,
		param: MashupApplication[T]
	): [SimpleApplication, Promise<MashupApplicationResultType<T>>] {
		let tempResolve: ((value: MashupApplicationResultType<T>) => void) | undefined = undefined;
		let tempReject: ((reason?: any) => void) | undefined = undefined;

		const resultPromise = new Promise<MashupApplicationResultType<T>>((resolve, reject) => {
			tempResolve = resolve;
			tempReject = reject;
		});
		if (!tempResolve || !tempReject) throw new Error(`Promise didn't provide callbacks.`);

		const [jsx, title, options] = applicationRegistry[messageType](param, tempResolve, tempReject);
		const dialog = new JsxDialog(jsx, { title, close: () => tempReject?.() }, options);
		dialog.render(true);

		return [
			dialog,
			resultPromise.finally(() => {
				dialog.close();
			}),
		];
	},
};

export function WrapApplicationDispatcher({ children }: { children?: React.ReactNode }) {
	return (
		<ApplicationDispatcherContextProvider value={applicationDispatcherContextValue}>
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

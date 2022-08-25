import { deferredPromise } from '@foundryvtt-dndmashup/core';
import {
	ApplicationSettings,
	ModalDispatcherContext,
	ModalDispatcherContextProvider,
	SimpleApplication,
} from '@foundryvtt-dndmashup/components';
import {
	ApplicationDispatcherContextProvider,
	ApplicationDispatcherContext,
	applicationRegistry,
	MashupApplicationResultType,
	MashupApplicationType,
} from '@foundryvtt-dndmashup/foundry-compat';
import { noop } from 'lodash/fp';
import { ReactApplicationMixin } from '../../core/react/react-application-mixin';

export const applicationDispatcher: ApplicationDispatcherContext = {
	async launchApplication<T extends MashupApplicationType>(
		messageType: T,
		param: MashupApplication[T]
	): Promise<{ dialog: SimpleApplication; result: Promise<MashupApplicationResultType<T>> }> {
		const { promise, resolve, reject } = deferredPromise<MashupApplicationResultType<T>>();
		const { content, title, options } = await applicationRegistry[messageType](param, resolve, reject);
		const dialog = new JsxDialog(content, { title, close: () => reject?.() }, options);
		dialog.render(true);

		promise
			.finally(() => {
				dialog.close();
			})
			// eats the error from the console without actually losing the error for anything looking at the result
			.catch(noop);

		return {
			dialog,
			result: promise,
		};
	},
};

export const modalDispatcher: ModalDispatcherContext = {
	launchModal(settings: ApplicationSettings, onClose: () => void) {
		const modal = new JsxDialog(settings.content, { title: settings.title, close: () => onClose() }, settings.options);

		return {
			modal,
			updateContent: (content) => {
				modal.jsx = content;
				modal.rerender();
			},
		};
	},
};

export function WrapApplicationDispatcher({ children }: { children?: React.ReactNode }) {
	return (
		<ApplicationDispatcherContextProvider value={applicationDispatcher}>
			<ModalDispatcherContextProvider value={modalDispatcher}>{children}</ModalDispatcherContextProvider>
		</ApplicationDispatcherContextProvider>
	);
}

class JsxDialog extends ReactApplicationMixin(Dialog) {
	constructor(
		public jsx: JSX.Element,
		data: Omit<Dialog.Data, 'buttons' | 'default' | 'content'>,
		options?: Partial<DialogOptions>
	) {
		super({ ...data, content: '', buttons: {}, default: '' }, options);
	}

	protected override _getJsx(): JSX.Element {
		return this.jsx;
	}
}

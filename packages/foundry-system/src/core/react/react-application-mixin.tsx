import { renderReact, unmountReact } from './internals';

export function ReactApplicationMixin<T extends ConstructorOf<Application>>(
	Base: T
): Pick<T, keyof T> &
	Pick<typeof ReactApplicationMixinPrototype, keyof typeof ReactApplicationMixinPrototype> & {
		new (...args: ConstructorParameters<T>): InstanceType<T> & ReactApplicationMixinPrototype & { rerender(): void };
	} {
	return class ReactApplicationMixinClass extends Base {
		private _rerender: ((newContent: JSX.Element) => void) | undefined = undefined;

		rerender(): void {
			this._rerender?.(this._getJsx());
		}

		protected _getJsx() {
			return <>JSX should be overridden by sheet</>;
		}

		protected override async _renderInner(): Promise<JQuery<HTMLElement>> {
			const { element: rootElement, rerender } = renderReact(this, this._getJsx());
			this._rerender = rerender;
			return $(rootElement);
		}

		protected override _replaceHTML(element: JQuery<HTMLElement>): void {
			if (!element.length) return;

			if (this.popOut) {
				element.find('.window-title').text(this.title);
			}
		}

		protected _disableFields(): void {
			// intentionally blank - let React disable the fields
		}

		override async close(options?: FormApplication.CloseOptions): Promise<void> {
			await super.close(options);
			unmountReact(this);
		}
	} as never;
}

declare class ReactApplicationMixinPrototype {
	protected _getJsx(): JSX.Element;
	protected _renderInner(): Promise<JQuery<HTMLElement>>;
	protected _replaceHTML(element: JQuery<HTMLElement>): void;
	protected _disableFields(): void;
	close(options?: FormApplication.CloseOptions): Promise<void>;
}

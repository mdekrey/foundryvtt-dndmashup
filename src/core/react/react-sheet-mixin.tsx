import { renderReact, Root } from './internals';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ReactSheetMixin = <T extends ConstructorOf<DocumentSheet<any, any, any>>>(
	Base: T
): Pick<T, keyof T> &
	Pick<typeof ReactSheetMixinPrototype, keyof typeof ReactSheetMixinPrototype> & {
		new (...args: ConstructorParameters<T>): InstanceType<T> & ReactSheetMixinPrototype;
	} =>
	class ReactSheetMixinClass extends Base {
		root: Root | null = null;

		protected _getJsx() {
			return <>JSX should be overridden by sheet</>;
		}

		protected async _renderInner(): Promise<JQuery<HTMLElement>> {
			[this.form, this.root] = renderReact(this, this._getJsx());
			return $(this.form);
		}

		protected _replaceHTML(element: JQuery<HTMLElement>): void {
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
			this.form = null;
			this.root?.unmount();
			this.root = null;
		}
	} as never;

declare class ReactSheetMixinPrototype {
	root: Root | null;
	protected _getJsx(): JSX.Element;
	protected _renderInner(): Promise<JQuery<HTMLElement>>;
	protected _replaceHTML(element: JQuery<HTMLElement>): void;
	protected _disableFields(): void;
	close(options?: FormApplication.CloseOptions): Promise<void>;
}

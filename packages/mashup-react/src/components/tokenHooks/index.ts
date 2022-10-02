import { useRef } from 'react';
import type { TokenInstance } from '../../module/actor/documentType';

export function useHoverToken() {
	const hovered = useRef<TokenInstance>();

	return (getToken: () => TokenInstance | undefined) => {
		function onMouseEnter(event: React.MouseEvent) {
			onMouseLeave(event);
			hovered.current = getToken();
			if (hovered.current) {
				// FIXME: this is using internal methods
				const temp: any = hovered.current;
				if (temp._onHoverIn) {
					temp._onHoverIn(event.nativeEvent);
				}
			}
		}
		function onMouseLeave(event: React.MouseEvent) {
			if (hovered.current) {
				// FIXME: this is using internal methods
				const temp: any = hovered.current;
				if (temp._onHoverOut) {
					temp._onHoverOut(event.nativeEvent);
				}
				hovered.current = undefined;
			}
		}
		return { onMouseEnter, onMouseLeave };
	};
}
export function useControlTokenOnClick() {
	return (getToken: () => TokenInstance | undefined) => {
		function onClick(event: React.MouseEvent) {
			const releaseOthers = !event.shiftKey;
			const target = getToken();
			if (target) {
				target.control?.({ releaseOthers });
			}
		}
		return { onClick };
	};
}

import { twMerge } from 'tailwind-merge';
import { useState, useRef, createContext, useContext, useMemo } from 'react';
import { Modal } from '../modal';
import { noop } from 'lodash/fp';
import { fieldClassName } from '../form-input/field';
import classNames from 'classnames';

type ModalContentsProps = {
	onClose: () => void;
};

type DetailsModalContext = {
	ignoreFocusChange(ignore: boolean): void;
	depth: number;
};
const detailsModalContext = createContext<DetailsModalContext>({ ignoreFocusChange: noop, depth: 0 });

export function DetailsModalButton({
	className,
	modalTitle,
	buttonContents,
	modalContents,
	disabled,
}: {
	className?: string;
	modalTitle: string;
	disabled?: boolean;
	buttonContents: React.ReactNode;
	modalContents: React.ReactNode | ((p: ModalContentsProps) => React.ReactNode);
}) {
	const ignoreFocusRef = useRef<boolean>(false);
	const { ignoreFocusChange, depth } = useContext(detailsModalContext);
	const divRef = useRef<HTMLDivElement>();
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [isOpen, innerSetOpen] = useState(false);

	const detailsModalContextValue = useMemo<DetailsModalContext>(
		() => ({
			ignoreFocusChange(ignore) {
				if (!ignore && ignoreFocusRef.current) focusSelf();
				setTimeout(() => {
					ignoreFocusRef.current = ignore;
				}, 100);
			},
			depth: depth + 1,
		}),
		[]
	);

	return (
		<>
			<button
				type="button"
				className={twMerge(classNames(fieldClassName, 'px-2 py-1 border-x border-t rounded'), className)}
				ref={buttonRef}
				onClick={disabled ? undefined : () => setOpen(true)}>
				{buttonContents}
			</button>
			<Modal isOpen={isOpen} onClose={() => setOpen(false)} title={modalTitle} options={{ resizable: false }}>
				<detailsModalContext.Provider value={detailsModalContextValue}>
					<div
						onBlur={onBlur}
						ref={(container) => {
							divRef.current = container ?? undefined;
							setTimeout(() => {
								focusSelf();
							}, 100);
						}}>
						{typeof modalContents === 'function' ? modalContents({ onClose: () => setOpen(false) }) : modalContents}
					</div>
				</detailsModalContext.Provider>
			</Modal>
		</>
	);

	function onBlur() {
		setTimeout(() => {
			if (ignoreFocusRef.current) return;
			if (!divRef.current?.contains(document.activeElement)) {
				setOpen(false);
			}
		});
	}

	function focusSelf() {
		if (divRef.current) {
			divRef.current
				.querySelector<Element & HTMLOrSVGElement>(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				)
				?.focus();
		}
	}

	function setOpen(isOpen: boolean) {
		ignoreFocusChange(isOpen);
		innerSetOpen(isOpen);
		if (!isOpen) {
			buttonRef.current?.focus();
		}
	}
}

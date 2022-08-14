import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';
import { useState, useRef } from 'react';
import { Modal } from '../modal';

type ModalContentsProps = {
	onClose: () => void;
};

export function DetailsModal({
	className,
	modalTitle,
	buttonContents,
	modalContents,
}: {
	className?: string;
	modalTitle: string;
	buttonContents: React.ReactNode;
	modalContents: React.ReactNode | ((p: ModalContentsProps) => React.ReactNode);
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [isOpen, setOpen] = useState(false);

	const onClose = () => {
		setOpen(false);
		buttonRef.current?.focus();
	};

	return (
		<>
			<button
				type="button"
				className={twMerge(
					classNames(
						'px-2 py-1 border border-black',
						'focus-within:ring-blue-bright-600 focus-within:ring-1',
						'hover:ring-blue-bright-600 hover:ring-1'
					),
					className
				)}
				ref={buttonRef}
				onClick={() => setOpen(true)}>
				{buttonContents}
			</button>
			<Modal isOpen={isOpen} onClose={() => setOpen(false)} title={modalTitle}>
				<div
					onBlur={onClose}
					ref={(container) => {
						if (container) {
							container
								.querySelector<Element & HTMLOrSVGElement>(
									'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
								)
								?.focus();
						}
					}}>
					{typeof modalContents === 'function' ? modalContents({ onClose }) : modalContents}
				</div>
			</Modal>
		</>
	);
}

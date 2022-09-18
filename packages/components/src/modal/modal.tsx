import { useEffect, useRef } from 'react';
import { useModalDispatcher } from './context';
import { ApplicationOptions, UpdatableModal } from './types';

export type ModalProps = {
	children?: React.ReactNode;
	title: string;
	options?: Partial<ApplicationOptions>;
	isOpen: boolean;
	onClose: () => void;
};

export function Modal({ children, title, options, isOpen, onClose: onCloseCallback }: ModalProps) {
	const isOpenRef = useRef<boolean>(false);
	const application = useModalDispatcher();
	const dialogRef = useRef<UpdatableModal>();
	if (dialogRef.current === undefined) {
		dialogRef.current = application.launchModal(
			{ content: <>{children}</>, title, options: { ...options, resizable: options?.resizable ?? true } },
			() => {
				dialogRef.current = undefined;

				if (isOpenRef.current) {
					isOpenRef.current = false;
					onCloseCallback();
				}
			}
		);
	}
	useEffect(() => dialogRef.current?.updateContent(<>{children}</>), [children]);
	useEffect(() => {
		if (isOpen) {
			isOpenRef.current = true;
			dialogRef.current?.modal.render(true);
		} else dialogRef.current?.modal.close();
	}, [isOpen]);
	useEffect(() => {
		return () => {
			dialogRef.current?.modal.close();
		};
	}, []);

	return null;
}

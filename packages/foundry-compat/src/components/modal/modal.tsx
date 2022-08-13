import { useEffect, useRef } from 'react';
import { useModalDispatcher, ApplicationOptions, UpdatableModal } from './context';

export type ModalProps = {
	children?: React.ReactNode;
	title: string;
	options?: ApplicationOptions;
	isOpen: boolean;
	onClose: () => void;
};

export function Modal({ children, title, options, isOpen, onClose }: ModalProps) {
	const application = useModalDispatcher();
	const dialogRef = useRef<UpdatableModal>();
	if (dialogRef.current === undefined) {
		dialogRef.current = application.launchModal({ content: <>{children}</>, title, options }, () => {
			dialogRef.current = undefined;
			onClose();
		});
	}
	useEffect(() => dialogRef.current?.updateContent(<>{children}</>), [children]);
	useEffect(() => {
		if (isOpen) dialogRef.current?.modal.render(true);
		else dialogRef.current?.modal.close();
	}, [isOpen]);
	useEffect(() => {
		return () => {
			dialogRef.current?.modal.close();
		};
	}, []);

	return null;
}

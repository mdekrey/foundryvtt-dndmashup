import { useState } from 'react';
import { IconButton, Modal, SvgButton } from '@foundryvtt-dndmashup/components';
import { Stateful } from '@foundryvtt-dndmashup/core';
import { ActiveEffectTemplate } from './types';
import { LightningBoltIcon } from '@heroicons/react/solid';
import { ActiveEffectTemplateEditor } from './ActiveEffectTemplateEditor';

export function ActiveEffectTemplateEditorButton({
	className,
	fallbackImage,
	iconClassName,
	title,
	activeEffectTemplate,
	description,
}: {
	className?: string;
	fallbackImage?: string | null;
	// TODO: this would be better with slots
	iconClassName?: string;
	title: string;
	activeEffectTemplate: Stateful<ActiveEffectTemplate>;
	description: string;
}) {
	const [editingEffect, setEditingEffect] = useState(false);
	return (
		<>
			{iconClassName ? (
				<IconButton
					className={className}
					iconClassName={iconClassName}
					title={title}
					onClick={() => setEditingEffect(true)}
				/>
			) : (
				<SvgButton
					className={className}
					icon={LightningBoltIcon}
					title={title}
					onClick={() => setEditingEffect(true)}
				/>
			)}
			<Modal
				title={title}
				isOpen={editingEffect}
				onClose={() => setEditingEffect(false)}
				options={{ resizable: true, width: 750 }}>
				<div className="grid grid-cols-1 min-h-64">
					<p>{description}</p>
					<ActiveEffectTemplateEditor fallbackImage={fallbackImage} {...activeEffectTemplate} />
				</div>
			</Modal>
		</>
	);
}

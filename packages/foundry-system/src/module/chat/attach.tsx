import { ToObjectFalseType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import { createRoot } from 'react-dom/client';
import { FoundryWrapper } from '../../components/foundry';

export type ChatMessageProps = ToObjectFalseType<ChatMessage>;

export const chatAttachments: Record<string, React.FC<ChatMessageProps>> = {};

export function attachToChat(html: JQuery<HTMLElement>, data: ChatMessage.MessageData) {
	if (typeof data.message.flags['attach-component'] !== 'string') return;

	const Component = chatAttachments[data.message.flags['attach-component']];
	if (!Component) {
		console.error('Unknown attach-component setting', data.message.flags['attach-component'], data);
		return;
	}

	const content = html.children('div.message-content');
	content.addClass('foundry-reset').addClass('dndmashup');

	console.log('attach chat message', content, Component, data.message);

	try {
		const jsx = Component(data.message);
		createRoot(content[0]).render(<FoundryWrapper>{jsx}</FoundryWrapper>);
	} catch (ex) {
		console.error(ex);
	}
}

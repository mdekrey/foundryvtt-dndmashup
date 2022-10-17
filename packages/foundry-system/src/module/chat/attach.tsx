import { ToObjectFalseType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import { createRoot } from 'react-dom/client';
import { FoundryWrapper } from '../../components/foundry';

export type ChatMessageProps = ToObjectFalseType<ChatMessage>; // ChatMessageDataProperties;

export const chatAttachments: Record<string, (props: ChatMessageProps) => React.ReactNode> = {};

export function attachToChat(html: JQuery<HTMLElement>, data: ChatMessage.MessageData) {
	if (typeof data.message.flags['attach-component'] !== 'string') return;

	const component = chatAttachments[data.message.flags['attach-component']];
	if (!component) {
		console.error('Unknown attach-component setting', data.message.flags['attach-component'], data);
		return;
	}

	const content = html.children('div.message-content');
	content.addClass('foundry-reset dndmashup');

	try {
		const children = component(data.message);
		createRoot(content[0]).render(<FoundryWrapper>{children}</FoundryWrapper>);
	} catch (ex) {
		content.children().addClass('sepia opacity-50 pointer-events-none');
		console.error(data.message._id, ex);
	}
}

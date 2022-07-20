import { WrapChatMessageDispatcher } from './chat-provider';
import { WrapImageEditor } from './wrap-image-editor';
import { WrapRichTextEditor } from './wrap-rich-text-editor';

export function FoundryWrapper({ children }: { children?: React.ReactNode }) {
	return (
		<WrapChatMessageDispatcher>
			<WrapRichTextEditor>
				<WrapImageEditor>{children}</WrapImageEditor>
			</WrapRichTextEditor>
		</WrapChatMessageDispatcher>
	);
}

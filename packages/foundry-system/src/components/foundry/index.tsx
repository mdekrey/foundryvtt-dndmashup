import { WrapChatMessageDispatcher } from './chat-provider';
import { ErrorBoundary } from './error-boundary';
import { WrapImageEditor } from './wrap-image-editor';
import { WrapRichTextEditor } from './wrap-rich-text-editor';

export function FoundryWrapper({ children }: { children?: React.ReactNode }) {
	return (
		<ErrorBoundary>
			<WrapChatMessageDispatcher>
				<WrapRichTextEditor>
					<WrapImageEditor>{children}</WrapImageEditor>
				</WrapRichTextEditor>
			</WrapChatMessageDispatcher>
		</ErrorBoundary>
	);
}

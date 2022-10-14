import { WrapApplicationDispatcher } from './apps-provider';
import { WrapChatMessageDispatcher } from './chat-provider';
import { ErrorBoundary } from './error-boundary';
import { WrapEvaluateBonusByType } from './evaluate-bonus-by-type-provider';
import { WrapUserPreferenceContextProvider } from './preference-provider';
import { WrapImageEditor } from './wrap-image-editor';
import { WrapRichTextEditor } from './wrap-rich-text-editor';

export function FoundryWrapper({ children }: { children?: React.ReactNode }) {
	return (
		<ErrorBoundary>
			<WrapUserPreferenceContextProvider>
				<WrapEvaluateBonusByType>
					<WrapApplicationDispatcher>
						<WrapChatMessageDispatcher>
							<WrapRichTextEditor>
								<WrapImageEditor>{children}</WrapImageEditor>
							</WrapRichTextEditor>
						</WrapChatMessageDispatcher>
					</WrapApplicationDispatcher>
				</WrapEvaluateBonusByType>
			</WrapUserPreferenceContextProvider>
		</ErrorBoundary>
	);
}

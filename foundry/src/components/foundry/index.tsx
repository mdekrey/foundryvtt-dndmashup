import { WrapImageEditor } from './wrap-image-editor';
import { WrapRichTextEditor } from './wrap-rich-text-editor';

export function FoundryWrapper({ children }: { children?: React.ReactNode }) {
	return (
		<WrapRichTextEditor>
			<WrapImageEditor>{children}</WrapImageEditor>
		</WrapRichTextEditor>
	);
}

import { chatAttachments } from '../attach';
import { chatMessageRegistry } from '@foundryvtt-dndmashup/mashup-react';

chatMessageRegistry['plain-text'] = async (actor, text) => {
	return {
		flags: { text },
	};
};
chatAttachments['plain-text'] = ({ flags: { text } }) => {
	return <>{text}</>;
};

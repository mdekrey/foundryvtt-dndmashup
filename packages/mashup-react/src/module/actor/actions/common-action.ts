import { ApplicationDispatcherContext } from '@foundryvtt-dndmashup/foundry-compat';
import { ChatMessageDispatcherContext } from '../../chat';
import { ActionType, PowerUsage } from '../../item';
import { ActorDocument } from '../documentType';

export type CommonAction = {
	name: string;
	action: ActionType;
	usage: PowerUsage;
	img: string;
	hint: string;
	isReady: (actor: ActorDocument) => boolean;
	setReady?: (actor: ActorDocument, ready: boolean) => void;
	use: (
		actor: ActorDocument,
		utils: { chatDispatch: ChatMessageDispatcherContext; appDispatch: ApplicationDispatcherContext }
	) => void;
};

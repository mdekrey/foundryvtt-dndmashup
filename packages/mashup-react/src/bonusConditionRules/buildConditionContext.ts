export type IntentionalConditionContext = {
	[K in keyof ConditionGrantingContext]: ConditionGrantingContext[K] | undefined;
};

export function buildConditionContext(context: IntentionalConditionContext): IntentionalConditionContext {
	return context;
}

export type TriggerType = keyof Triggers;
export type Trigger<TType extends TriggerType = TriggerType> = {
	[K in TType]: {
		trigger: K;
		parameter: Triggers[K];
	};
}[TType];

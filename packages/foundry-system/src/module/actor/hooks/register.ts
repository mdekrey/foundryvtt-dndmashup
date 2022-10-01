import { PowerDocument } from '@foundryvtt-dndmashup/mashup-react';

Hooks.on('preActionPointSpent', function rechargePowersOnActionPointSpent(actor, params, descriptions) {
	const powers = actor
		.allPowers(true)
		.filter((p) => p.system.rechargeTrigger?.trigger === 'spendActionPoint')
		.filter((p) => !actor.isReady(p))
		.filter((p): p is PowerDocument & { powerGroupId: string } => !!p.powerGroupId);
	if (powers.length === 0) return;

	for (const power of powers) {
		params[`data.powerUsage.${power.powerGroupId}`] = 0;
		descriptions.push(`Recharged ${power.name}.`);
	}
});

import { applicationRegistry } from '@foundryvtt-dndmashup/foundry-compat';
import { PowerPreview } from '@foundryvtt-dndmashup/mashup-react';

applicationRegistry.powerDetails = async ({ power }) => ({
	content: <PowerPreview item={power} />,
	title: `Use Power: ${power.name}`,
});

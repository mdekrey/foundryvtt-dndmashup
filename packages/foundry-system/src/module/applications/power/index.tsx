import { applicationRegistry, PowerPreview } from '@foundryvtt-dndmashup/mashup-react';

applicationRegistry.powerDetails = ({ power }) => [<PowerPreview item={power} />, `Use Power: ${power.name}`];

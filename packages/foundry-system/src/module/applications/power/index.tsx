import { applicationRegistry } from '@foundryvtt-dndmashup/mashup-react';
import { PowerDialog } from './PowerDialog';

applicationRegistry.powerDetails = ({ power }) => PowerDialog.create(power);

import { CommonAction } from './common-action';
import { longRest } from './longRest';
import { secondWind } from './secondWind';
import { shortRest } from './shortRest';
import { spendActionPoint } from './spendActionPoint';
import { totalDefense } from './totalDefense';

export * from './common-action';
export * from './isPower';

export const commonActions: CommonAction[] = [totalDefense, secondWind, spendActionPoint, shortRest, longRest];

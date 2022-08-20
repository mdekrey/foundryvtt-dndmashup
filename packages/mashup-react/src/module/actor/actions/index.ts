import { CommonAction } from './common-action';
import { secondWind } from './secondWind';
import { spendActionPoint } from './spendActionPoint';
import { totalDefense } from './totalDefense';

export * from './common-action';
export * from './isPower';

export const commonActions: CommonAction[] = [totalDefense, secondWind, spendActionPoint];

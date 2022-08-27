import { mergeStyles, recurse } from '@foundryvtt-dndmashup/core';

export const cardRowFormat = recurse(
	mergeStyles(<p className="even:bg-gradient-to-r from-tan-fading px-2 font-info leading-snug" />)
);

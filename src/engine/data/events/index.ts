import { GameEvent } from '../../types';
import { macroEvents } from './macroEvents';
import { fundingEvents } from './fundingEvents';
import { productEvents } from './productEvents';
import { teamEvents } from './teamEvents';
import { salesEvents } from './salesEvents';
import { pivotEvents } from './pivotEvents';
import { newBusinessEvents } from './newBusinessEvents';

export const allPhase4Events: GameEvent[] = [
  ...macroEvents,
  ...fundingEvents,
  ...productEvents,
  ...teamEvents,
  ...salesEvents,
  ...pivotEvents,
  ...newBusinessEvents,
];

import type { Writable as SvelteWritable } from 'svelte/store';

export interface BBXProduct {
  id: number;
  title: string;
  href: string;
  pricePerPart: number;
  matchTo: string;
  partColor?: string;
  partNr?: string;
}

// t
/*
export enum Filter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

*/

// import type { Element } from '../data/elements';
import { elements } from '../data/elements';

export interface BondingRule {
  element1: string;
  element2: string;
  bondType: 'single' | 'double' | 'triple';
  idealLength: number;
  maxDistance: number;
}

export const bondingRules: BondingRule[] = [
  // Hydrogen bonds
  { element1: 'H', element2: 'H', bondType: 'single', idealLength: 0.74, maxDistance: 1.2 },
  { element1: 'H', element2: 'C', bondType: 'single', idealLength: 1.09, maxDistance: 1.5 },
  { element1: 'H', element2: 'N', bondType: 'single', idealLength: 1.01, maxDistance: 1.4 },
  { element1: 'H', element2: 'O', bondType: 'single', idealLength: 0.96, maxDistance: 1.3 },
  { element1: 'H', element2: 'F', bondType: 'single', idealLength: 0.92, maxDistance: 1.2 },
  
  // Carbon bonds
  { element1: 'C', element2: 'C', bondType: 'single', idealLength: 1.54, maxDistance: 2.0 },
  { element1: 'C', element2: 'C', bondType: 'double', idealLength: 1.34, maxDistance: 1.8 },
  { element1: 'C', element2: 'C', bondType: 'triple', idealLength: 1.20, maxDistance: 1.6 },
  { element1: 'C', element2: 'N', bondType: 'single', idealLength: 1.47, maxDistance: 1.9 },
  { element1: 'C', element2: 'N', bondType: 'double', idealLength: 1.29, maxDistance: 1.7 },
  { element1: 'C', element2: 'N', bondType: 'triple', idealLength: 1.16, maxDistance: 1.5 },
  { element1: 'C', element2: 'O', bondType: 'single', idealLength: 1.43, maxDistance: 1.8 },
  { element1: 'C', element2: 'O', bondType: 'double', idealLength: 1.20, maxDistance: 1.6 },
  
  // Nitrogen bonds
  { element1: 'N', element2: 'N', bondType: 'single', idealLength: 1.45, maxDistance: 1.9 },
  { element1: 'N', element2: 'N', bondType: 'double', idealLength: 1.25, maxDistance: 1.7 },
  { element1: 'N', element2: 'N', bondType: 'triple', idealLength: 1.10, maxDistance: 1.4 },
  { element1: 'N', element2: 'O', bondType: 'single', idealLength: 1.36, maxDistance: 1.8 },
  { element1: 'N', element2: 'O', bondType: 'double', idealLength: 1.22, maxDistance: 1.6 },
  
  // Oxygen bonds
  { element1: 'O', element2: 'O', bondType: 'single', idealLength: 1.48, maxDistance: 1.9 },
  { element1: 'O', element2: 'O', bondType: 'double', idealLength: 1.21, maxDistance: 1.6 },
];

export function getBondingRule(elem1: string, elem2: string): BondingRule | null {
  // Check both directions since bonding is symmetric
  let rule = bondingRules.find(r => 
    (r.element1 === elem1 && r.element2 === elem2) ||
    (r.element1 === elem2 && r.element2 === elem1)
  );
  
  return rule || null;
}

export function canElementsBond(elem1: string, elem2: string, distance: number): boolean {
  const rule = getBondingRule(elem1, elem2);
  return rule ? distance <= rule.maxDistance : false;
}

export function getIdealBondLength(elem1: string, elem2: string): number {
  const rule = getBondingRule(elem1, elem2);
  return rule ? rule.idealLength : 1.5; // Default bond length
}

export function determineValency(elementSymbol: string): number {
  const element = elements[elementSymbol];
  if (!element) return 0;
  
  // Simplified valency determination based on group
  switch (element.group) {
    case 1: return 1; // Alkali metals
    case 2: return 2; // Alkaline earth metals
    case 13: return 3; // Boron group
    case 14: return 4; // Carbon group
    case 15: return 3; // Nitrogen group (can be 3 or 5)
    case 16: return 2; // Oxygen group (can be 2, 4, or 6)
    case 17: return 1; // Halogens
    case 18: return 0; // Noble gases
    default: return 2; // Default
  }
}

export function getMaxBonds(elementSymbol: string): number {
  const element = elements[elementSymbol];
  if (!element) return 4;
  
  // Maximum number of bonds an element can typically form
  switch (elementSymbol) {
    case 'H': return 1;
    case 'C': return 4;
    case 'N': return 4; // including lone pairs
    case 'O': return 2;
    case 'F': return 1;
    case 'Cl': return 1;
    case 'Br': return 1;
    case 'I': return 1;
    default: return determineValency(elementSymbol);
  }
}

export function predictBondType(elem1: string, elem2: string, electronegativeDiff: number): 'single' | 'double' | 'triple' {
  // Simple heuristics for bond type prediction
  if (elem1 === 'C' && elem2 === 'C') {
    // Carbon-carbon bonds can be single, double, or triple
    return 'single'; // Default to single, can be upgraded based on context
  }
  
  if (elem1 === 'C' && elem2 === 'O') {
    return electronegativeDiff > 1.5 ? 'double' : 'single';
  }
  
  if (elem1 === 'N' && elem2 === 'N') {
    return 'triple'; // N≡N is very stable
  }
  
  return 'single'; // Default to single bond
}
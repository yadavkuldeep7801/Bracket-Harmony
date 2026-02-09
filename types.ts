
export type Bracket = '(' | ')' | '{' | '}' | '[' | ']';
export type AlgorithmMode = 'stack' | 'queue';

export interface Step {
  index: number;
  structure: string[]; // Generic name for stack or queue
  currentChar: string | null;
  action: 'push' | 'pop' | 'match' | 'mismatch' | 'empty-error' | 'final-check' | 'start';
  message: string;
  isValidSoFar: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  steps: Step[];
  errorIndex?: number;
}

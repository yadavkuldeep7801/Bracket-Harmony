
import { Step, ValidationResult, Bracket, AlgorithmMode } from '../types';

const pairs: Record<string, string> = {
  ')': '(',
  '}': '{',
  ']': '[',
};

const names: Record<string, string> = {
  '(': 'Parenthesis',
  '[': 'Square Bracket',
  '{': 'Curly Brace',
};

export const validateParentheses = (s: string, mode: AlgorithmMode = 'stack'): ValidationResult => {
  const steps: Step[] = [];
  const buffer: string[] = []; // Used as stack or queue
  
  steps.push({
    index: -1,
    structure: [],
    currentChar: null,
    action: 'start',
    message: `Initializing validation using ${mode.toUpperCase()} logic...`,
    isValidSoFar: true,
  });

  for (let i = 0; i < s.length; i++) {
    const char = s[i] as Bracket;
    const currentBuffer = [...buffer];

    if (['(', '{', '['].includes(char)) {
      buffer.push(char);
      steps.push({
        index: i,
        structure: [...buffer],
        currentChar: char,
        action: 'push',
        message: `Opening ${names[char]} found. Adding '${char}' to the ${mode}.`,
        isValidSoFar: true,
      });
    } else {
      // Logic split based on Mode
      const removed = mode === 'stack' ? buffer.pop() : buffer.shift();
      
      if (!removed) {
        steps.push({
          index: i,
          structure: [],
          currentChar: char,
          action: 'empty-error',
          message: `Closing ${names[char]} found, but the ${mode} is empty! No match found.`,
          isValidSoFar: false,
        });
        return { isValid: false, steps, errorIndex: i };
      }

      if (removed !== pairs[char]) {
        steps.push({
          index: i,
          structure: [...currentBuffer],
          currentChar: char,
          action: 'mismatch',
          message: `${mode.toUpperCase()} Mismatch! Found '${char}' but expected match for '${removed}' (${mode === 'stack' ? 'Top' : 'Front'} of ${mode}).`,
          isValidSoFar: false,
        });
        return { isValid: false, steps, errorIndex: i };
      }

      steps.push({
        index: i,
        structure: [...buffer],
        currentChar: char,
        action: 'match',
        message: `Success! '${char}' matches with the '${removed}' from the ${mode}. Removing...`,
        isValidSoFar: true,
      });
    }
  }

  const finalValid = buffer.length === 0;
  steps.push({
    index: s.length,
    structure: [...buffer],
    currentChar: null,
    action: 'final-check',
    message: finalValid 
      ? `End of string. ${mode.charAt(0).toUpperCase() + mode.slice(1)} is empty. The input is VALID under ${mode} logic.` 
      : `End of string. ${mode} still has ${buffer.length} items. The input is INVALID.`,
    isValidSoFar: finalValid,
  });

  return { isValid: finalValid, steps };
};

// Intentional separate learner bug. The supplied adapter does not use this.
// Input is untrusted JSON text; return true only for the exact scenario contract.
import {coachScenario} from '../src/scenarios.mjs';

const ANSWER_KEYS = ['cardId', 'explanation', 'kind', 'ruleId'];

export function acceptAnswer(text, scenarioId) {
  const scenario = coachScenario(scenarioId);
  if (!scenario) return false;

  try {
    const answer = JSON.parse(text);
    if (answer === null || typeof answer !== 'object' || Array.isArray(answer)) return false;

    const keys = Object.keys(answer).sort();
    if (keys.length !== ANSWER_KEYS.length || keys.some((key, index) => key !== ANSWER_KEYS[index])) return false;

    const expectedCardId = scenario.id === 'suggest' ? 'practice-red-3' : null;
    return answer.kind === scenario.kind
      && answer.ruleId === scenario.rule
      && answer.cardId === expectedCardId
      && typeof answer.explanation === 'string'
      && answer.explanation.length >= 10
      && answer.explanation.length <= 1200;
  } catch {
    return false;
  }
}

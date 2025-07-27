import { FormField, ConditionalRule } from '@/types/form';

export function evaluateConditionalRule(
  rule: ConditionalRule,
  formData: Record<string, any>
): boolean {
  const fieldValue = formData[rule.fieldId];
  const ruleValue = rule.value;

  switch (rule.operator) {
    case 'equals':
      if (Array.isArray(ruleValue)) {
        return ruleValue.includes(fieldValue);
      }
      return fieldValue === ruleValue;

    case 'not_equals':
      if (Array.isArray(ruleValue)) {
        return !ruleValue.includes(fieldValue);
      }
      return fieldValue !== ruleValue;

    case 'contains':
      if (typeof fieldValue === 'string' && typeof ruleValue === 'string') {
        return fieldValue.toLowerCase().includes(ruleValue.toLowerCase());
      }
      return false;

    case 'not_contains':
      if (typeof fieldValue === 'string' && typeof ruleValue === 'string') {
        return !fieldValue.toLowerCase().includes(ruleValue.toLowerCase());
      }
      return true;

    case 'greater':
      if (typeof fieldValue === 'number' && typeof ruleValue === 'number') {
        return fieldValue > ruleValue;
      }
      return false;

    case 'less':
      if (typeof fieldValue === 'number' && typeof ruleValue === 'number') {
        return fieldValue < ruleValue;
      }
      return false;

    case 'is_empty':
      return !fieldValue || fieldValue === '' || fieldValue === null || fieldValue === undefined;

    case 'is_not_empty':
      return fieldValue && fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;

    default:
      return false;
  }
}

export function shouldShowField(
  field: FormField,
  formData: Record<string, any>
): boolean {
  // If no conditional logic, always show
  if (!field.conditionalLogic || !field.conditionalLogic.enabled) {
    return true;
  }

  const { condition, rules, operator } = field.conditionalLogic;

  if (rules.length === 0) {
    return true;
  }

  let result: boolean;

  if (operator === 'and') {
    // All rules must be true
    result = rules.every(rule => evaluateConditionalRule(rule, formData));
  } else {
    // At least one rule must be true
    result = rules.some(rule => evaluateConditionalRule(rule, formData));
  }

  // If condition is 'show', return the result as is
  // If condition is 'hide', return the opposite
  return condition === 'show' ? result : !result;
}

export function getAvailableFieldsForConditions(
  currentFieldId: string,
  allFields: FormField[]
): FormField[] {
  // Validate inputs
  if (!currentFieldId || !allFields || !Array.isArray(allFields)) {
    console.error('Invalid parameters for getAvailableFieldsForConditions:', {
      currentFieldId,
      allFields
    });
    return [];
  }

  // Only return fields that come before the current field
  // This prevents circular dependencies
  const currentIndex = allFields.findIndex(f => f && f.id === currentFieldId);
  
  // If field not found, return empty array to prevent errors
  if (currentIndex === -1) {
    console.warn('Current field not found in allFields array:', currentFieldId);
    return [];
  }
  
  return allFields.slice(0, currentIndex).filter(field => 
    field && field.type && 
    // Only allow fields that can have meaningful conditions
    ['text', 'email', 'number', 'select', 'radio', 'checkbox', 'rating', 'likert', 'section'].includes(field.type)
  );
}

export function getOperatorsForFieldType(fieldType: string): Array<{value: string, label: string}> {
  const baseOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'is_empty', label: 'Is Empty' },
    { value: 'is_not_empty', label: 'Is Not Empty' },
  ];

  switch (fieldType) {
    case 'text':
    case 'email':
    case 'textarea':
      return [
        ...baseOperators,
        { value: 'contains', label: 'Contains' },
        { value: 'not_contains', label: 'Does Not Contain' },
      ];

    case 'number':
    case 'rating':
    case 'likert':
      return [
        ...baseOperators,
        { value: 'greater', label: 'Greater Than' },
        { value: 'less', label: 'Less Than' },
      ];

    case 'select':
    case 'radio':
    case 'checkbox':
      return baseOperators;

    default:
      return baseOperators;
  }
}

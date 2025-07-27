import { FormField } from '@/types/form';

/**
 * Get the next section ID based on field value and jump logic
 */
export function getNextSectionId(
  field: FormField,
  value: any,
  allFields: FormField[]
): string | null {
  // If no section jump logic enabled, continue normally
  if (!field.sectionJumpLogic?.enabled) {
    return getNextSectionIdNormal(field.id, allFields);
  }

  // Find the jump rule for the selected value
  const jumpRule = field.sectionJumpLogic.jumpRules.find(
    rule => rule.optionValue === value
  );

  if (!jumpRule) {
    return getNextSectionIdNormal(field.id, allFields);
  }

  switch (jumpRule.action) {
    case 'next':
      return getNextSectionIdNormal(field.id, allFields);
    case 'jump':
      return jumpRule.targetSectionId || null;
    case 'submit':
      return 'SUBMIT';
    default:
      return getNextSectionIdNormal(field.id, allFields);
  }
}

/**
 * Get the next section ID in normal flow (without jump logic)
 */
function getNextSectionIdNormal(
  currentFieldId: string,
  allFields: FormField[]
): string | null {
  const currentIndex = allFields.findIndex(f => f.id === currentFieldId);
  
  if (currentIndex === -1) return null;

  // Find next section after current field
  for (let i = currentIndex + 1; i < allFields.length; i++) {
    if (allFields[i].type === 'section') {
      return allFields[i].id;
    }
  }

  // No more sections, return null (end of form)
  return null;
}

/**
 * Get all sections in a form
 */
export function getAllSections(fields: FormField[]): FormField[] {
  if (!fields || !Array.isArray(fields)) {
    return [];
  }
  return fields.filter(field => field.type === 'section');
}

/**
 * Get fields that appear before the first section
 */
export function getFieldsBeforeFirstSection(allFields: FormField[]): FormField[] {
  if (!allFields || !Array.isArray(allFields)) {
    return [];
  }
  
  const fieldsBeforeFirst: FormField[] = [];
  
  // Get all fields before the first section
  for (let i = 0; i < allFields.length; i++) {
    if (allFields[i].type === 'section') {
      break; // Stop at first section
    }
    fieldsBeforeFirst.push(allFields[i]);
  }

  return fieldsBeforeFirst;
}

/**
 * Get fields that belong to a specific section
 */
export function getFieldsInSection(
  sectionId: string,
  allFields: FormField[]
): FormField[] {
  if (!allFields || !Array.isArray(allFields)) {
    return [];
  }
  
  const sectionIndex = allFields.findIndex(f => f.id === sectionId);
  if (sectionIndex === -1) return [];

  const fieldsInSection: FormField[] = [];
  
  // Get all fields after this section until next section or end
  for (let i = sectionIndex + 1; i < allFields.length; i++) {
    if (allFields[i].type === 'section') {
      break; // Stop at next section
    }
    fieldsInSection.push(allFields[i]);
  }

  return fieldsInSection;
}

/**
 * Check if form has section-based navigation
 */
export function hasSectionBasedNavigation(fields: FormField[]): boolean {
  if (!fields || !Array.isArray(fields)) {
    return false;
  }
  return fields.some(field => field.type === 'section');
}

/**
 * Get section progress (current section number and total sections)
 */
export function getSectionProgress(
  currentSectionId: string,
  allFields: FormField[]
): { current: number; total: number } {
  if (!allFields || !Array.isArray(allFields)) {
    return { current: 1, total: 1 };
  }
  
  const sections = getAllSections(allFields);
  const currentIndex = sections.findIndex(s => s.id === currentSectionId);
  
  return {
    current: currentIndex + 1,
    total: sections.length
  };
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file' | 'matrix' | 'rating' | 'likert' | 'section' | 'signature' | 'heading' | 'image';
  label: string;
  placeholder?: string;
  required?: boolean;
  // Image attachment for any field (for questions with images)
  fieldImage?: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    position?: 'above' | 'below' | 'left' | 'right';
  };
  options?: string[]; // For select, radio, checkbox
  // Quiz/Exam settings for multiple choice questions
  quizSettings?: {
    enabled: boolean;
    correctAnswer?: string | string[]; // Single answer for radio, multiple for checkbox
    points?: number; // Points for correct answer
    explanation?: string; // Explanation shown after answering
    showExplanation?: 'always' | 'correct' | 'incorrect'; // When to show explanation
    // Essay settings
    essayKeyAnswer?: string; // Key answer for essay questions
    essayKeywords?: string[]; // Important keywords that should be present
    essayMinWords?: number; // Minimum word count
    essayMaxWords?: number; // Maximum word count
    essayGradingType?: 'keyword' | 'similarity' | 'ai'; // Grading method
    essayPassingThreshold?: number; // Minimum similarity percentage to pass (0-100)
  };
  // Section Jump Logic - for each option, define where to go next
  sectionJumpLogic?: {
    enabled: boolean;
    jumpRules: {
      optionValue: string; // The option value
      action: 'next' | 'jump' | 'submit'; // What to do
      targetSectionId?: string; // Which section to jump to (if action is 'jump')
    }[];
  };
  // Section field properties
  sectionSettings?: {
    description?: string;
    showProgress?: boolean;
    allowPrevious?: boolean;
    allowNext?: boolean;
    nextButtonText?: string;
    previousButtonText?: string;
  };
  // Matrix field properties
  matrixRows?: string[]; // For matrix questions
  matrixColumns?: string[]; // For matrix answers
  matrixType?: 'radio' | 'checkbox' | 'text' | 'number' | 'email' | 'date' | 'textarea'; // Matrix input type
  // Rating field properties
  ratingMax?: number; // Maximum rating value (default: 5)
  ratingIcon?: 'star' | 'heart' | 'thumbs' | 'number'; // Rating display type
  // Likert scale properties
  likertScale?: {
    min: number;
    max: number;
    minLabel?: string;
    maxLabel?: string;
    steps?: number;
  };
  // Signature field properties
  signatureSettings?: {
    width?: number;
    height?: number;
    penColor?: string;
    backgroundColor?: string;
  };
  // Heading field properties
  headingSettings?: {
    level: 1 | 2 | 3 | 4 | 5 | 6; // h1, h2, h3, h4, h5, h6
    alignment?: 'left' | 'center' | 'right';
    color?: string;
  };
  // Image field properties
  imageSettings?: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    alignment?: 'left' | 'center' | 'right';
  };
  // Conditional Logic
  conditionalLogic?: {
    enabled: boolean;
    condition: 'show' | 'hide'; // Show or hide this field
    rules: ConditionalRule[];
    operator: 'and' | 'or'; // How to combine multiple rules
  };
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface ConditionalRule {
  fieldId: string; // The field to check
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater' | 'less' | 'is_empty' | 'is_not_empty';
  value: string | number | string[]; // The value to compare against
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings: {
    showTitle: boolean;
    showDescription: boolean;
    submitButtonText: string;
    redirectUrl?: string;
    theme?: 'light' | 'dark' | 'custom';
    // Section-based settings
    sectionBased?: boolean;
    showProgressBar?: boolean;
    allowSectionNavigation?: boolean;
    validateOnSectionChange?: boolean;
    // Quiz/Exam settings
    quizMode?: boolean;
    quizSettings?: {
      showCorrectAnswers?: boolean; // Show correct answers after submission
      showScore?: boolean; // Show score after submission
      allowRetake?: boolean; // Allow multiple attempts
      timeLimit?: number; // Time limit in minutes
      passingScore?: number; // Minimum score to pass (percentage)
      shuffleQuestions?: boolean; // Randomize question order
      shuffleOptions?: boolean; // Randomize option order
      showResultsImmediately?: boolean; // Show results immediately or after time limit
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface DragItem {
  id: string;
  type: string;
  field?: FormField;
}

export interface DropResult {
  dropEffect: string;
  draggingNode: DragItem;
  destinationIndex?: number;
}

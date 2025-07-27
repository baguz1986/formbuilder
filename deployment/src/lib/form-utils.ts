import { FormField } from '@/types/form';
import { v4 as uuidv4 } from 'uuid';

export const fieldTemplates: Record<string, Omit<FormField, 'id'>> = {
  text: {
    type: 'text',
    label: 'Input Teks',
    placeholder: 'Masukkan teks...',
    required: false,
  },
  email: {
    type: 'email',
    label: 'Alamat Email',
    placeholder: 'Masukkan email...',
    required: false,
    validation: {
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    },
  },
  number: {
    type: 'number',
    label: 'Input Angka',
    placeholder: 'Masukkan angka...',
    required: false,
  },
  textarea: {
    type: 'textarea',
    label: 'Area Teks',
    placeholder: 'Masukkan teks panjang...',
    required: false,
    validation: {
      maxLength: 500,
    },
  },
  select: {
    type: 'select',
    label: 'Dropdown',
    placeholder: 'Pilih opsi...',
    required: false,
    options: ['Opsi 1', 'Opsi 2', 'Opsi 3'],
  },
  radio: {
    type: 'radio',
    label: 'Tombol Radio',
    required: false,
    options: ['Opsi 1', 'Opsi 2', 'Opsi 3'],
  },
  checkbox: {
    type: 'checkbox',
    label: 'Kotak Centang',
    required: false,
    options: ['Opsi 1', 'Opsi 2', 'Opsi 3'],
  },
  date: {
    type: 'date',
    label: 'Pemilih Tanggal',
    required: false,
  },
  file: {
    type: 'file',
    label: 'Upload File',
    required: false,
  },
  matrix: {
    type: 'matrix',
    label: 'Pertanyaan Matriks',
    required: false,
    matrixRows: ['Baris 1', 'Baris 2', 'Baris 3'],
    matrixColumns: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'],
    matrixType: 'radio',
  },
  rating: {
    type: 'rating',
    label: 'Rating Bintang',
    required: false,
    ratingMax: 5,
    ratingIcon: 'star',
  },
  likert: {
    type: 'likert',
    label: 'Skala Likert',
    required: false,
    likertScale: {
      min: 1,
      max: 7,
      minLabel: 'Sangat Tidak Setuju',
      maxLabel: 'Sangat Setuju',
      steps: 7,
    },
  },
  section: {
    type: 'section',
    label: 'Pemisah Bagian',
    required: false,
    sectionSettings: {
      description: 'Ini adalah bagian baru dari form',
      showProgress: true,
      allowPrevious: true,
      allowNext: true,
      nextButtonText: 'Lanjutkan',
      previousButtonText: 'Kembali',
    },
  },
  signature: {
    type: 'signature',
    label: 'Tanda Tangan Digital',
    required: false,
    signatureSettings: {
      width: 400,
      height: 200,
      penColor: '#000000',
      backgroundColor: '#ffffff',
    },
  },
  heading: {
    type: 'heading',
    label: 'Teks Judul',
    required: false,
    headingSettings: {
      level: 2,
      alignment: 'left',
      color: '#000000',
    },
  },
  image: {
    type: 'image',
    label: 'Gambar Inline',
    required: false,
    imageSettings: {
      src: '',
      alt: 'Deskripsi gambar',
      width: 300,
      height: 200,
      alignment: 'center',
    },
  },
};

export function createFieldFromTemplate(type: string): FormField {
  const template = fieldTemplates[type];
  if (!template) {
    throw new Error(`Unknown field type: ${type}`);
  }
  
  return {
    id: uuidv4(),
    ...template,
  };
}

export function validateField(field: FormField, value: any): string | null {
  if (field.required && (!value || value === '')) {
    return `${field.label} wajib diisi`;
  }

  if (!value) return null;

  const { validation } = field;
  if (!validation) return null;

  if (validation.minLength && value.length < validation.minLength) {
    return `${field.label} harus minimal ${validation.minLength} karakter`;
  }

  if (validation.maxLength && value.length > validation.maxLength) {
    return `${field.label} tidak boleh lebih dari ${validation.maxLength} karakter`;
  }

  if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
    return `Format ${field.label} tidak valid`;
  }

  if (validation.min && Number(value) < validation.min) {
    return `${field.label} harus minimal ${validation.min}`;
  }

  if (validation.max && Number(value) > validation.max) {
    return `${field.label} tidak boleh lebih dari ${validation.max}`;
  }

  return null;
}

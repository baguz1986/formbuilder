// API route for app settings
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// Settings file path
const SETTINGS_FILE = path.join(process.cwd(), 'app-settings.json');

// Default settings
const defaultSettings = {
  appName: 'FormBuilder',
  appDescription: 'Platform pembuat form yang mudah dan powerful',
  logo: '/logo.svg',
  primaryColor: '#6366f1',
  language: 'id',
  allowRegistration: true,
  requireApproval: false,
  landingTitle: 'Buat Form Cantik dalam Hitungan Menit',
  landingSubtitle: 'Platform terdepan untuk membuat form interaktif',
  landingDescription: 'Buat form profesional dengan drag-and-drop builder kami. Kumpulkan respons, analisis data, dan bagikan form Anda ke seluruh dunia—tanpa perlu coding.',
  heroTitle: 'Build Beautiful Forms',
  heroSubtitle: 'in Minutes',
  heroDescription: 'Create professional forms with our intuitive drag-and-drop builder. Collect responses, analyze data, and share your forms with the world—all without code.',
  features: [
    'Drag & Drop Form Builder',
    'AI Essay Grading System',
    'Real-time Analytics',
    'Custom Branding',
    'Multi-language Support',
    'Advanced Quiz Features'
  ]
};

// Load settings from file
function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return defaultSettings;
  } catch (error) {
    console.error('Error loading settings:', error);
    return defaultSettings;
  }
}

// Save settings to file
function saveSettings(settings: any) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

export async function GET() {
  try {
    const settings = loadSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Load current settings and merge with new ones
    const currentSettings = loadSettings();
    const updatedSettings = { ...currentSettings, ...body };
    
    // Save to file
    if (saveSettings(updatedSettings)) {
      return NextResponse.json(updatedSettings);
    } else {
      return NextResponse.json(
        { error: 'Failed to save settings' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

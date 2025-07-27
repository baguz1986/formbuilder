import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: formId } = await params;

    // Get form with submissions
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        user: {
          email: session.user.email
        }
      },
      include: {
        submissions: true
      }
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const formSchema = JSON.parse(form.schema);
    const submissions = form.submissions.map((sub: any) => ({
      id: sub.id,
      data: JSON.parse(sub.data),
      createdAt: sub.submittedAt
    }));

    // Generate analytics
    const analytics = generateAnalytics(formSchema, submissions);

    return NextResponse.json({
      form: {
        id: form.id,
        title: form.title,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        isPublished: form.isPublished
      },
      submissions,
      analytics,
      totalSubmissions: submissions.length
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateAnalytics(formSchema: any, submissions: any[]) {
  const analytics: any = {
    overview: {
      totalSubmissions: submissions.length,
      submissionsToday: submissions.filter(s => 
        new Date(s.createdAt).toDateString() === new Date().toDateString()
      ).length,
      submissionsThisWeek: submissions.filter(s => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(s.createdAt) >= weekAgo;
      }).length,
      submissionsThisMonth: submissions.filter(s => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return new Date(s.createdAt) >= monthAgo;
      }).length
    },
    fieldAnalytics: {},
    timeAnalytics: generateTimeAnalytics(submissions),
    completionRate: calculateCompletionRate(formSchema, submissions)
  };

  // Analyze each field
  formSchema.fields?.forEach((field: any) => {
    const fieldData = submissions.map(s => s.data[field.id]).filter(Boolean);
    
    analytics.fieldAnalytics[field.id] = {
      fieldLabel: field.label,
      fieldType: field.type,
      totalResponses: fieldData.length,
      responseRate: submissions.length > 0 ? (fieldData.length / submissions.length * 100).toFixed(1) : 0,
      ...analyzeFieldData(field, fieldData)
    };
  });

  return analytics;
}

function analyzeFieldData(field: any, data: any[]) {
  switch (field.type) {
    case 'multiple-choice':
    case 'dropdown':
      return analyzeChoiceField(field, data);
    case 'rating':
      return analyzeRatingField(data);
    case 'likert':
      return analyzeLikertField(field, data);
    case 'matrix':
      return analyzeMatrixField(field, data);
    case 'number':
      return analyzeNumberField(data);
    case 'text':
    case 'textarea':
    case 'email':
      return analyzeTextField(data);
    default:
      return { responses: data };
  }
}

function analyzeChoiceField(field: any, data: any[]) {
  const choices = field.options || [];
  const choiceCounts: { [key: string]: number } = {};
  
  choices.forEach((choice: any) => {
    choiceCounts[choice.value] = 0;
  });

  data.forEach(response => {
    if (Array.isArray(response)) {
      // Multiple selection
      response.forEach((choice: string) => {
        if (choiceCounts.hasOwnProperty(choice)) {
          choiceCounts[choice]++;
        }
      });
    } else if (typeof response === 'string' && choiceCounts.hasOwnProperty(response)) {
      choiceCounts[response]++;
    }
  });

  return {
    choiceDistribution: Object.entries(choiceCounts).map(([choice, count]) => ({
      choice,
      count,
      percentage: data.length > 0 ? (count / data.length * 100).toFixed(1) : 0
    })),
    mostPopular: Object.entries(choiceCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || null
  };
}

function analyzeRatingField(data: any[]) {
  const ratings = data.filter(d => typeof d === 'number');
  const average = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  
  const distribution: { [key: number]: number } = {};
  for (let i = 1; i <= 5; i++) {
    distribution[i] = ratings.filter(r => r === i).length;
  }

  return {
    average: average.toFixed(1),
    distribution: Object.entries(distribution).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
      percentage: ratings.length > 0 ? (count / ratings.length * 100).toFixed(1) : 0
    })),
    totalRated: ratings.length
  };
}

function analyzeLikertField(field: any, data: any[]) {
  const questions = field.questions || [];
  const scale = field.scale || ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
  
  const questionAnalytics: { [key: string]: any } = {};
  
  questions.forEach((question: any) => {
    const questionResponses = data.map(d => d[question.id]).filter(Boolean);
    const scaleCounts: { [key: string]: number } = {};
    
    scale.forEach((scaleItem: string) => {
      scaleCounts[scaleItem] = questionResponses.filter(r => r === scaleItem).length;
    });
    
    questionAnalytics[question.id] = {
      question: question.text,
      responses: questionResponses.length,
      distribution: Object.entries(scaleCounts).map(([scaleItem, count]) => ({
        scale: scaleItem,
        count,
        percentage: questionResponses.length > 0 ? (count / questionResponses.length * 100).toFixed(1) : 0
      }))
    };
  });

  return { questionAnalytics };
}

function analyzeMatrixField(field: any, data: any[]) {
  const rows = field.rows || [];
  const columns = field.columns || [];
  
  const matrixAnalytics: { [key: string]: any } = {};
  
  rows.forEach((row: any) => {
    const rowResponses = data.map(d => d[row.id]).filter(Boolean);
    const columnCounts: { [key: string]: number } = {};
    
    columns.forEach((col: any) => {
      columnCounts[col.value] = rowResponses.filter(r => r === col.value).length;
    });
    
    matrixAnalytics[row.id] = {
      row: row.value,
      responses: rowResponses.length,
      distribution: Object.entries(columnCounts).map(([column, count]) => ({
        column,
        count,
        percentage: rowResponses.length > 0 ? (count / rowResponses.length * 100).toFixed(1) : 0
      }))
    };
  });

  return { matrixAnalytics };
}

function analyzeNumberField(data: any[]) {
  const numbers = data.filter(d => typeof d === 'number' || !isNaN(parseFloat(d))).map(d => parseFloat(d));
  
  if (numbers.length === 0) {
    return { average: 0, min: 0, max: 0, total: 0 };
  }

  return {
    average: (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2),
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    total: numbers.reduce((a, b) => a + b, 0),
    count: numbers.length
  };
}

function analyzeTextField(data: any[]) {
  const texts = data.filter(d => typeof d === 'string' && d.trim().length > 0);
  const wordCounts = texts.map(text => text.trim().split(/\s+/).length);
  const avgWordCount = wordCounts.length > 0 ? wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length : 0;

  return {
    totalResponses: texts.length,
    averageWordCount: avgWordCount.toFixed(1),
    longestResponse: Math.max(...wordCounts, 0),
    shortestResponse: wordCounts.length > 0 ? Math.min(...wordCounts) : 0,
    commonWords: extractCommonWords(texts)
  };
}

function extractCommonWords(texts: string[]) {
  const allWords = texts
    .join(' ')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);

  const wordCounts: { [key: string]: number } = {};
  allWords.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  return Object.entries(wordCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}

function generateTimeAnalytics(submissions: any[]) {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      count: 0
    };
  });

  submissions.forEach(submission => {
    const submissionDate = new Date(submission.createdAt).toISOString().split('T')[0];
    const dayData = last30Days.find(day => day.date === submissionDate);
    if (dayData) {
      dayData.count++;
    }
  });

  // Hour distribution
  const hourDistribution = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
  submissions.forEach(submission => {
    const hour = new Date(submission.createdAt).getHours();
    hourDistribution[hour].count++;
  });

  return {
    dailySubmissions: last30Days,
    hourlyDistribution: hourDistribution,
    peakDay: last30Days.reduce((max, day) => day.count > max.count ? day : max, last30Days[0]),
    peakHour: hourDistribution.reduce((max, hour) => hour.count > max.count ? hour : max, hourDistribution[0])
  };
}

function calculateCompletionRate(formSchema: any, submissions: any[]) {
  if (!formSchema.fields || submissions.length === 0) return 100;

  const requiredFields = formSchema.fields.filter((field: any) => field.required);
  if (requiredFields.length === 0) return 100;

  const completedSubmissions = submissions.filter(submission => {
    return requiredFields.every((field: any) => {
      const value = submission.data[field.id];
      return value !== undefined && value !== null && value !== '';
    });
  });

  return ((completedSubmissions.length / submissions.length) * 100).toFixed(1);
}

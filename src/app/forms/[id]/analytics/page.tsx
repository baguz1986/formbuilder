'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Download, Users, TrendingUp, Clock, CheckCircle, Eye, Calendar, BarChart3 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface AnalyticsData {
  form: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    isPublished: boolean;
  };
  submissions: any[];
  analytics: {
    overview: {
      totalSubmissions: number;
      submissionsToday: number;
      submissionsThisWeek: number;
      submissionsThisMonth: number;
    };
    fieldAnalytics: { [key: string]: any };
    timeAnalytics: {
      dailySubmissions: { date: string; count: number }[];
      hourlyDistribution: { hour: number; count: number }[];
      peakDay: { date: string; count: number };
      peakHour: { hour: number; count: number };
    };
    completionRate: string;
  };
  totalSubmissions: number;
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#84CC16', '#EC4899'];

export default function AnalyticsPage() {
  const params = useParams();
  const formId = params.id as string;
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [formId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/forms/${formId}/analytics`);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Tidak memiliki akses. Silakan login kembali.');
        } else if (response.status === 404) {
          throw new Error('Form tidak ditemukan atau Anda tidak memiliki akses.');
        } else {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
      }
      
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError(error instanceof Error ? error.message : 'Gagal memuat data analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const response = await fetch(`/api/forms/${formId}/export`);
      if (response.ok) {
        const exportData = await response.json();
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Create main data sheet
        const wsData = XLSX.utils.aoa_to_sheet([exportData.data.headers, ...exportData.data.rows]);
        XLSX.utils.book_append_sheet(wb, wsData, 'Submissions');
        
        // Create summary sheet
        if (data) {
          const summaryData = [
            ['Form Analytics Summary'],
            [''],
            ['Form Title', data.form.title],
            ['Total Submissions', data.analytics.overview.totalSubmissions],
            ['Submissions Today', data.analytics.overview.submissionsToday],
            ['Submissions This Week', data.analytics.overview.submissionsThisWeek],
            ['Submissions This Month', data.analytics.overview.submissionsThisMonth],
            ['Completion Rate', `${data.analytics.completionRate}%`],
            ['Peak Day', data.analytics.timeAnalytics.peakDay.date],
            ['Peak Hour', `${data.analytics.timeAnalytics.peakHour.hour}:00`],
            [''],
            ['Field Response Rates'],
            ['Field', 'Total Responses', 'Response Rate']
          ];
          
          Object.values(data.analytics.fieldAnalytics).forEach((field: any) => {
            summaryData.push([field.fieldLabel, field.totalResponses, `${field.responseRate}%`]);
          });
          
          const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
          XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
        }
        
        // Save file
        XLSX.writeFile(wb, exportData.filename);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Memuat data analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <Button onClick={fetchAnalytics} className="bg-blue-600 hover:bg-blue-700 text-white">
              Coba Lagi
            </Button>
            <br />
            <Button variant="outline" onClick={() => window.history.back()}>
              Kembali
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900">Form tidak ditemukan</h2>
          <p className="text-gray-600 mt-2">Form yang Anda cari tidak ada atau Anda tidak memiliki akses.</p>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mt-4"
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{data.form.title}</h1>
              <p className="text-gray-600 mt-2">Form Analytics & Reports</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={exportToExcel}
                disabled={exporting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export Excel'}
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{data.analytics.overview.totalSubmissions}</div>
              <p className="text-xs text-gray-600">
                +{data.analytics.overview.submissionsToday} today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{data.analytics.overview.submissionsThisWeek}</div>
              <p className="text-xs text-gray-600">
                {data.analytics.overview.submissionsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{data.analytics.completionRate}%</div>
              <p className="text-xs text-gray-600">
                Field completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Time</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{data.analytics.timeAnalytics.peakHour.hour}:00</div>
              <p className="text-xs text-gray-600">
                Most active hour
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="fields" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Eye className="w-4 h-4 mr-2" />
              Field Analysis
            </TabsTrigger>
            <TabsTrigger value="time" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Time Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Daily Submissions Chart */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Submissions Over Time (Last 30 Days)</CardTitle>
                <CardDescription>Daily submission trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.analytics.timeAnalytics.dailySubmissions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value: any) => [value, 'Submissions']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Hourly Distribution */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Hourly Distribution</CardTitle>
                <CardDescription>When do people submit your form?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.analytics.timeAnalytics.hourlyDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="hour" 
                        tickFormatter={(value) => `${value}:00`}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => `${value}:00`}
                        formatter={(value: any) => [value, 'Submissions']}
                      />
                      <Bar dataKey="count" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fields" className="space-y-6">
            {Object.entries(data.analytics.fieldAnalytics).map(([fieldId, fieldData]: [string, any]) => (
              <Card key={fieldId} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>{fieldData.fieldLabel}</CardTitle>
                  <CardDescription>
                    {fieldData.totalResponses} responses ({fieldData.responseRate}% response rate)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderFieldAnalytics(fieldData)}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="time" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Peak Activity</CardTitle>
                  <CardDescription>Your busiest times</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Peak Day</p>
                      <p className="font-semibold text-blue-600">
                        {new Date(data.analytics.timeAnalytics.peakDay.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {data.analytics.timeAnalytics.peakDay.count}
                      </p>
                      <p className="text-sm text-gray-600">submissions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Peak Hour</p>
                      <p className="font-semibold text-green-600">
                        {data.analytics.timeAnalytics.peakHour.hour}:00
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {data.analytics.timeAnalytics.peakHour.count}
                      </p>
                      <p className="text-sm text-gray-600">submissions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function renderFieldAnalytics(fieldData: any) {
  switch (fieldData.fieldType) {
    case 'multiple-choice':
    case 'dropdown':
      return (
        <div className="space-y-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fieldData.choiceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ choice, percentage }: any) => `${choice}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {fieldData.choiceDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [value, 'Responses']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {fieldData.choiceDistribution.map((choice: any, index: number) => (
              <div key={choice.choice} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  {choice.choice}
                </div>
                <div className="text-sm text-gray-600">
                  {choice.count} ({choice.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'rating':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{fieldData.average}/5</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Ratings</p>
              <p className="font-semibold">{fieldData.totalRated}</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fieldData.distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip formatter={(value: any) => [value, 'Responses']} />
                <Bar dataKey="count" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );

    case 'number':
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Average</p>
            <p className="text-xl font-bold text-blue-600">{fieldData.average}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Minimum</p>
            <p className="text-xl font-bold text-green-600">{fieldData.min}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Maximum</p>
            <p className="text-xl font-bold text-red-600">{fieldData.max}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-xl font-bold text-purple-600">{fieldData.total}</p>
          </div>
        </div>
      );

    case 'text':
    case 'textarea':
    case 'email':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Responses</p>
              <p className="text-xl font-bold text-blue-600">{fieldData.totalResponses}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg Words</p>
              <p className="text-xl font-bold text-green-600">{fieldData.averageWordCount}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Longest</p>
              <p className="text-xl font-bold text-orange-600">{fieldData.longestResponse}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Shortest</p>
              <p className="text-xl font-bold text-purple-600">{fieldData.shortestResponse}</p>
            </div>
          </div>
          
          {fieldData.commonWords && fieldData.commonWords.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Most Common Words</h4>
              <div className="flex flex-wrap gap-2">
                {fieldData.commonWords.slice(0, 10).map((word: any, index: number) => (
                  <span 
                    key={word.word}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {word.word} ({word.count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="text-center p-8 text-gray-500">
          <p>No specific analytics available for this field type</p>
          <p className="text-sm mt-1">{fieldData.totalResponses} total responses</p>
        </div>
      );
  }
}

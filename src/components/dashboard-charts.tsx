
'use client';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
    { day: "Monday", tests: 4, summaries: 2 },
    { day: "Tuesday", tests: 3, summaries: 3 },
    { day: "Wednesday", tests: 6, summaries: 4 },
    { day: "Thursday", tests: 4, summaries: 1 },
    { day: "Friday", tests: 8, summaries: 2 },
    { day: "Saturday", tests: 2, summaries: 1 },
    { day: "Sunday", tests: 1, summaries: 0 },
  ];

const pieData = [
  { subject: 'Math', value: 85, fill: 'var(--color-math)' },
  { subject: 'Science', value: 92, fill: 'var(--color-science)' },
  { subject: 'History', value: 78, fill: 'var(--color-history)' },
  { subject: 'English', value: 88, fill: 'var(--color-english)' },
];

const chartConfig = {
    tests: {
      label: "Tests",
      color: "hsl(var(--chart-1))",
    },
    summaries: {
      label: "Summaries",
      color: "hsl(var(--chart-2))",
    },
    math: { label: 'Math', color: 'hsl(var(--chart-1))' },
    science: { label: 'Science', color: 'hsl(var(--chart-2))' },
    history: { label: 'History', color: 'hsl(var(--chart-3))' },
    english: { label: 'English', color: 'hsl(var(--chart-4))' },
};


export function DashboardCharts() {
  return (
    <>
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="tests" fill="var(--color-tests)" radius={4} />
                <Bar dataKey="summaries" fill="var(--color-summaries)" radius={4} />
            </BarChart>
            </ChartContainer>
        </CardContent>
      </Card>
      <Card>
          <CardHeader>
              <CardTitle className="font-headline">Subject Scores</CardTitle>
          </CardHeader>
          <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                          <ChartTooltip content={<ChartTooltipContent nameKey="subject" />} />
                          <Pie data={pieData} dataKey="value" nameKey="subject" />
                      </PieChart>
                  </ResponsiveContainer>
              </ChartContainer>
          </CardContent>
      </Card>
    </>
  );
}

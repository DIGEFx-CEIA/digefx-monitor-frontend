import { getDeviceMetricsAction } from '@/features/dashboard/actions/getDeviceMetrics.action';

export async function GET() {
  const metricsResult = await getDeviceMetricsAction();

  if (!metricsResult.success) {
    return Response.json({ error: metricsResult.error }, { status: 500 });
  }

  const {value: metrics} = metricsResult;
  return Response.json(metrics);
}
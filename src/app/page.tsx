import { getDeviceMetricsAction } from '@/features/dashboard/actions/getDeviceMetrics.action';
import DashboardContainer from '@/features/dashboard/dashboard-container';
export default async function Page() {

  const metricsResult = await getDeviceMetricsAction();

  if (!metricsResult.success) {
    console.error(metricsResult.error);
    return null;
  }

  const {value: initialMetrics} = metricsResult;

  return <DashboardContainer initialMetrics={initialMetrics} />;
}

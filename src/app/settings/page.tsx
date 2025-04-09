import { getDeviceMetricsAction } from '@/features/dashboard/actions/getDeviceMetrics.action';
import { Settings } from '@/features/settings/actions/form-validation.action';
import SettingsForm from '@/features/settings/settings-form';
export default async function Page() {

  const metricsResult = await getDeviceMetricsAction();

  if (!metricsResult.success) {
    console.error(metricsResult.error);
    return null;
  }

  
  const {value: initialMetrics} = metricsResult;
  const initialSettings: Settings = {
    device_id:initialMetrics.device_status.device_id,
    min_voltage:initialMetrics.device_status.min_voltage,
    relay1_time:initialMetrics.device_status.relay1_time,
    relay2_time:initialMetrics.device_status.relay2_time,
  }

  return <SettingsForm initialSettings={initialSettings}/>;
}

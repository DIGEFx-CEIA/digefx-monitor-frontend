import { getCameraStatusAction } from '@/features/dashboard/actions/getCameraStatus.action';

export async function GET() {
  const cameraStatusResult = await getCameraStatusAction();

  if (!cameraStatusResult.success) {
    return Response.json({ error: cameraStatusResult.error }, { status: 500 });
  }

  const {value: cameraStatus} = cameraStatusResult;
  return Response.json(cameraStatus);
} 
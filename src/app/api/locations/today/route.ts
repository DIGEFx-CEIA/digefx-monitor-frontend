import { getTodayLocationsAction } from '@/features/dashboard/actions/getTodayLocations.action';

export async function GET() {
  const locationsResult = await getTodayLocationsAction();
  if (!locationsResult.success) {
    return Response.json({ error: locationsResult.error }, { status: 500 });
  }

  const {value: locations} = locationsResult;
  return Response.json(locations);
} 
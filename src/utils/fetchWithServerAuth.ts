import { getInternalServerSession } from "@/libs/nextAuth";
import { RedirectType, redirect } from "next/navigation";

export default async function fetchWithServerAuth(input: string | URL | Request, init?: RequestInit & { accessToken?: string; }): Promise<Response> {
	init ??= {};
	init.headers = init.headers ?? {};

	if (!(init.body instanceof FormData) && !Object.keys(init.headers).includes("Content-Type")) {
		init.headers["Content-Type"] = "application/json";
	}

	if (!Object.keys(init.headers).includes("Authorization")) {
		const accessToken = init.accessToken || (await getInternalServerSession())?.accessToken;
		console.log(accessToken);
		init.headers = {
			...init.headers,
			Authorization: `Bearer ${accessToken}`
		};
	}

	delete init.accessToken;
	const response = await fetch(input, init);

	if (response.status === 401 || response.status === 403) {
		redirect('/api/auth/signout', RedirectType.replace);
	}

	return response;
}

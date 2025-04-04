export { default } from "next-auth/middleware"

export const config = {
	// Ignora rotas public/ assets/api routes/_next
	matcher: "/((?!api|static|.*\\..*|_next).*)"
};
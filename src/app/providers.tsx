"use client";

import { MuiTheme } from "@/libs/muiTheme";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";

export const Providers = (props: Readonly<{ children: React.ReactNode }>) => {
	return (
		<ThemeProvider theme={MuiTheme}>
			<CssBaseline enableColorScheme />
			<SessionProvider>{props.children}
			</SessionProvider>
		</ThemeProvider>
	);
};

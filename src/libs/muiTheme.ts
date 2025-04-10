"use client";

import { createTheme, type PaletteOptions } from "@mui/material";
import { PaletteColorOptions, PaletteColor } from '@mui/material/styles';
import { Inter } from "next/font/google";

const interFont = Inter({
	weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
	style: ["normal"],
	subsets: ["latin", "latin-ext"],
});

declare module '@mui/material/styles' {
	interface Palette {
		navbar?: PaletteColor;
	}
	interface PaletteOptions {
		navbar?: PaletteColorOptions;
	}
}

declare module '@mui/material/AppBar' {
	interface AppBarPropsColorOverrides {
		navbar: true;
	}
  }

const palette: PaletteOptions = {
	mode: "dark",
	background: {
		default: "#191922",
	},
	primary: {
		main: "#7eaa33",
		contrastText: "#fcfcfc",
		dark: "#578321",
		light: "#8eba3b",
		"50": "#e9f1dc",
		"100": "#ddeac4",
		"200": "#c6dc9e",
		"300": "#b0ce77",
		"400": "#9ec459",
		"500": "#8eba3b",
		"600": "#7eaa33",
		"700": "#6a9729",
		"800": "#578321",
		"900": "#34620f",
	},
	navbar: {
		main: "#000022",
		contrastText: "#fcfcfc",
		dark: "#04a3da",
		light: "#04a3da",
	},
	secondary: {
		main: "#04a3da",
		contrastText: "#fcfcfc",
		dark: "#04a3da",
		light: "#04a3da",
		"50": "#e2eef5",
		"100": "#b7d6e7",
		"200": "#8cbcd8",
		"300": "#64a2c8",
		"400": "#4890bf",
		"500": "#2e7fb5",
		"600": "#2473aa",
		"700": "#196399",
		"800": "#0f5388",
		"900": "#003869",
	},
};

export const MuiTheme = createTheme({
	palette,
	typography: {
		fontFamily: interFont.style.fontFamily,
	},
	components: {
		MuiCard: {
			defaultProps: {
				variant: "outlined",
			},
		},
		MuiTextField: {
			defaultProps: {
				fullWidth: true,
				variant: "outlined",
				InputLabelProps: {
					sx: {
						color: "#0000006d",
					},
				},
				sx: {
					"& .MuiInputBase-root.Mui-disabled fieldset.MuiOutlinedInput-notchedOutline":
					{
						borderStyle: "dashed",
					},
				},
			},
		},
		MuiDialog: {
			defaultProps: {
				fullWidth: true,
			},
		},
		MuiSkeleton: {
			defaultProps: {
				animation: "wave",
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
			},
		},
		MuiChip: {
			defaultProps: {
				size: "small",
			},
		},
		MuiTab: {
			defaultProps: {
				iconPosition: "end",
			},
		},
		MuiTooltip: {
			defaultProps: {
				arrow: true,
				slotProps: {
					tooltip: {
						sx: {
							fontSize: ".8em",
						},
					},
				},
			},
		},
	},
});

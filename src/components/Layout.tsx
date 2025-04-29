import { Box } from "@mui/material";
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box display="flex">
      <Navbar />
      <Sidebar />
      <Box component="main" flexGrow={1} p={3} bgcolor={"background.default"}>
        {children}
      </Box>
    </Box>
  );
} 
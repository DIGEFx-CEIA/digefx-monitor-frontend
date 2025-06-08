"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode, useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Garantir que o componente seja hidratado corretamente
  useEffect(() => {
    setMounted(true);
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Fechar a sidebar automaticamente quando mudar para visualização móvel
  useEffect(() => {
    if (mounted) {
      setSidebarOpen(!isMobile);
    }
  }, [isMobile, mounted]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Não renderizar até estar montado no cliente
  if (!mounted) {
    return (
      <Box display="flex" flexDirection="column" height="100vh">
        <Navbar toggleSidebar={toggleSidebar} />
        <Box display="flex" flexGrow={1} position="relative" marginTop="64px">
          <Sidebar open={false} isMobile={true} toggleSidebar={toggleSidebar} />
          <Box 
            component="main" 
            flexGrow={1} 
            p={{ xs: 2, sm: 3 }}
            bgcolor={"background.default"}
            sx={{
              width: '100%',
              transition: 'margin 0.2s ease-in-out, width 0.2s ease-in-out'
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Navbar toggleSidebar={toggleSidebar} />
      <Box display="flex" flexGrow={1} position="relative" marginTop="64px">
        <Sidebar open={sidebarOpen} isMobile={isMobile} toggleSidebar={toggleSidebar} />
        <Box 
          component="main" 
          flexGrow={1} 
          p={{ xs: 2, sm: 3 }}
          bgcolor={"background.default"}
          sx={{
            width: {
              xs: '100%',
              md: sidebarOpen ? 'calc(100% - 240px)' : '100%'
            },
            transition: 'margin 0.2s ease-in-out, width 0.2s ease-in-out'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
} 
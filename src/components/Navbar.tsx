"use client";

import { Box, Typography, AppBar, Avatar, Toolbar, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { LogoutOutlined, Menu } from "@mui/icons-material";
import { useSession, signOut } from "next-auth/react";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1] ? name.split(' ')[1][0] : ''}`,
  };
}

interface NavbarProps {
  toggleSidebar: () => void;
}

export function Navbar({ toggleSidebar }: NavbarProps) {
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSignOut = (e: React.FormEvent) => {
    e.preventDefault();
    signOut();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 9999, height: '64px' }} color="navbar" variant="elevation" enableColorOnDark>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          edge="start"
          sx={{ mr: 1 }}
        >
          <Menu />
        </IconButton>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={isMobile ? 150 : 210} 
              height={isMobile ? 30 : 40} 
            />
          </Link>
        </Box>
        {session && (
          <Box display="flex" alignItems="center">
            <Avatar {...stringAvatar(session.user?.name || "User")} sx={{ marginRight: isMobile ? 1 : 2 }} />
            {!isMobile && (
              <Typography variant="body1" sx={{ marginRight: 2 }}>
                {session.user?.name || "User"}
              </Typography>
            )}
            <form onSubmit={handleSignOut}>
              <Tooltip title="Logout" arrow>
                <IconButton type="submit" color="inherit">
                  <LogoutOutlined />
                </IconButton>
              </Tooltip>
            </form>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
} 
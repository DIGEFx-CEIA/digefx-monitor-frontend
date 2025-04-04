import { Box, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar,  Avatar, Toolbar, IconButton, Tooltip, ListItemButton } from "@mui/material";
import { getInternalServerSession } from "@/libs/nextAuth";
import Image from "next/image";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";
import { ReactNode } from "react";
import { Providers } from "./providers";
import { LogoutOutlined } from "@mui/icons-material";

const drawerWidth = 240;

export const metadata: Metadata = {
  title: "Digefx Monitor",
  description: "Monitoramento de veículos",
  applicationName: "Digefx Monitor",
  icons: {
    icon: "/favicon.png",
  },
};

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

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


async function Navbar() {
  const session = await getInternalServerSession();
  return (
    <AppBar position="fixed" sx={{ zIndex: 9999 }} color="navbar" variant="elevation" enableColorOnDark>
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={210} height={40} />
          </Link>
        </Box>
        {session && (
          <Box display="flex" alignItems="center">
            <Avatar {...stringAvatar(session.user?.name || "User")} sx={{ marginRight: 2 }} />
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {session.user?.name || "User"}
            </Typography>
            <form action="/api/auth/signout" method="POST">
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

function Sidebar() {
  return (
    <Drawer variant="persistent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }} open>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {[
            { text: "Home", icon: <HomeIcon />, link: "/" },
            { text: "Settings", icon: <SettingsIcon />, link: "/settings" },
            { text: "Users", icon: <PeopleIcon />,link: "/users" },
          ].map((item, index) => (
            <ListItem key={index}>
              <Link href={item.link} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemButton aria-label={item.text}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en">
      <body>
        <Providers>
          <Box display="flex">
            <Navbar />
            <Sidebar />
            <Box component="main" flexGrow={1} p={3} bgcolor={"background.default"}>
              {children}
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
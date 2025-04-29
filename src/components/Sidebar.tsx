"use client";

import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, SwipeableDrawer, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ open, isMobile, toggleSidebar }: SidebarProps) {
  const menuItems = [
    { text: "Home", icon: <HomeIcon />, link: "/" },
    { text: "Settings", icon: <SettingsIcon />, link: "/settings" },
    { text: "Users", icon: <PeopleIcon />, link: "/users" },
  ];

  const sidebarContent = (
    <Box sx={{ overflow: 'auto' }}>
      {isMobile && (
        <Box display="flex" justifyContent="flex-end" p={1}>
          <IconButton onClick={toggleSidebar} aria-label="fechar menu">
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <Link href={item.link} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }} onClick={isMobile ? toggleSidebar : undefined}>
              <ListItemButton aria-label={item.text}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Em dispositivos móveis, usamos SwipeableDrawer para uma melhor experiência
  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={toggleSidebar}
        onOpen={toggleSidebar}
        sx={{
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          zIndex: (theme) => theme.zIndex.appBar - 1
        }}
      >
        {sidebarContent}
      </SwipeableDrawer>
    );
  }

  // Em desktop, usamos Drawer persistente
  return (
    <Drawer
      variant="persistent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          top: '64px',
          height: 'calc(100% - 64px)'
        },
      }} 
      open={open}>
      {sidebarContent}
    </Drawer>
  );
} 
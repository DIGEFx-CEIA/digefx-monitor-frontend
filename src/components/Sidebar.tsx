import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, ListItemButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";

const drawerWidth = 240;

export function Sidebar() {
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
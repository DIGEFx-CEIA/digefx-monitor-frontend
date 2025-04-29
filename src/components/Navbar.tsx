import { Box, Typography, AppBar, Avatar, Toolbar, IconButton, Tooltip } from "@mui/material";
import { getInternalServerSession } from "@/libs/nextAuth";
import Image from "next/image";
import Link from "next/link";
import { LogoutOutlined } from "@mui/icons-material";

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

export async function Navbar() {
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
import { Box, CircularProgress, Typography } from "@mui/material";

export default async function Page() {

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        p: 3,
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h3" component="h1" gutterBottom>
        Under Construction
      </Typography>
      <Typography variant="body1" align="center">
        We are working hard to bring you a new and improved experience.
      </Typography>
    </Box>
  );
}

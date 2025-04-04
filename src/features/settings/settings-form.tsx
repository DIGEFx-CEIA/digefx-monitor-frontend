"use client";

import { Controller, useForm } from "react-hook-form";
import { updateSettings } from "./actions/settings-form.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, TextField, Button, Container, Grid2 as Grid, Slider, Typography, Alert, Snackbar, SnackbarCloseReason, SlideProps, Slide } from "@mui/material";
import { Settings, settingsSchema } from "./actions/form-validation.action";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { convertMinutesToHoursMinutes } from "@/utils/time.utils";


type SettingsFormProps = {
    initialSettings: Settings;
};
export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [type, setType] = useState<"success" | "error" | "warning" | "info">("success");
    const { register, handleSubmit, control, formState: { errors } } = useForm<Settings>({
        resolver: zodResolver(settingsSchema),
        defaultValues: initialSettings,
    });
    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    function SlideTransition(props: SlideProps) {
        return <Slide {...props} direction="up" />;
    }
    const onSubmit = async (data: Settings) => {
        try {
            // Calling the server action directly. Next.js handles the serialization.
            const result = await updateSettings(data);
            setMessage(result.message);
            setType(result.success ? "success" : "error");
            setOpen(true);
            if (result.success) {
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            setMessage("Error saving settings.");
            setType("error");
            setOpen(true);
        }
    };
    return (
        <Container sx={{ mt: 8 }}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} TransitionComponent={SlideTransition} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert
                    onClose={handleClose}
                    severity={type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
            <Typography variant="h2">System Settings</Typography>
            <Typography variant="subtitle1">Define the Power Supply and System Settings</Typography>
            <Grid container spacing={4}
                component="form" mt={3}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <Tooltip title="DigeFX Device Identifier" arrow>
                    <Grid spacing={2} container width={1} alignItems={"center"}>
                        <Grid size={{ xs: 12, md: 3 }} direction="row" display={"flex"} alignItems={"center"}>
                            <Image src={"/car-battery.png"} width={40} height={40} alt="Device ID" />
                            <Typography variant="h6" ml={1}>Device ID</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 9 }} >
                            <TextField
                                {...register("device_id")}
                                error={!!errors.device_id}
                                helperText={errors.device_id?.message}
                            />
                        </Grid>

                    </Grid>

                </Tooltip>


                <Controller
                    name="min_voltage"
                    control={control}
                    render={({ field, fieldState: { error } }) => (

                        <Tooltip title="Vehicle battery safety voltage" arrow>
                            <Grid spacing={2} container width={1} alignItems={"center"}>
                                <Grid size={{ xs: 12, md: 3 }} direction="row" display={"flex"} alignItems={"center"}>
                                    <Image src={"/car-battery.png"} width={40} height={40} alt="Min Voltage" />
                                    <Typography variant="h6" ml={1}>Min Voltage</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 9 }} >
                                    <Slider

                                        value={field.value}
                                        onChange={(_, value) => field.onChange(value as number)}
                                        step={0.1}
                                        min={9}
                                        max={15}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => `${value} V`}
                                    />
                                </Grid>
                                {error && <Grid size={12}><p style={{ color: "#ff1744", margin: 0 }}>{error.message}</p></Grid>}

                            </Grid>
                        </Tooltip>

                    )}
                />

                <Controller
                    name="relay1_time"
                    control={control}
                    render={({ field, fieldState: { error } }) => (

                        <Tooltip title="Time for camera deactivation after vehicle shutdown (in minutes)" arrow>
                            <Grid spacing={2} container width={1} alignItems={"center"}>
                                <Grid size={{ xs: 12, md: 3 }} direction="row" display={"flex"} alignItems={"center"}>
                                    <Image src={"/camera-on.png"} width={40} height={40} alt="Camera Time" />
                                    <Typography variant="h6" ml={1}>Camera Time</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 9 }} >
                                    <Slider

                                        value={field.value}
                                        onChange={(_, value) => field.onChange(value as number)}
                                        step={1}
                                        min={1}
                                        max={300}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => convertMinutesToHoursMinutes(value)}
                                    />
                                </Grid>
                                {error && <Grid size={12}><p style={{ color: "#ff1744", margin: 0 }}>{error.message}</p></Grid>}

                            </Grid>
                        </Tooltip>

                    )}
                />

                <Controller
                    name="relay2_time"
                    control={control}
                    render={({ field, fieldState: { error } }) => (

                        <Tooltip title="Time for complete system deactivation after vehicle shutdown (in minutes)" arrow>
                            <Grid spacing={2} container width={1} alignItems={"center"}>
                                <Grid size={{ xs: 12, md: 3 }} direction="row" display={"flex"} alignItems={"center"}>
                                    <Image src={"/pc-on.png"} width={40} height={40} alt="System Time" />
                                    <Typography variant="h6" ml={1}>System Time</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 9 }} >
                                    <Slider

                                        value={field.value}
                                        onChange={(_, value) => field.onChange(value as number)}
                                        step={1}
                                        min={1}
                                        max={300}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => convertMinutesToHoursMinutes(value)}
                                    />
                                </Grid>
                                {error && <Grid size={12}><p style={{ color: "#ff1744", margin: 0 }}>{error.message}</p></Grid>}

                            </Grid>
                        </Tooltip>

                    )}
                />

                <Button type="submit" variant="contained">
                    Save
                </Button>
            </Grid>
        </Container>
    );
}
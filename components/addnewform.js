import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Dialog, MenuItem, Modal, Select } from "@mui/material";
import { Label } from "@mui/icons-material";
import img from "../assets/loadinggif.gif";
import Image from "next/image";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
const theme = createTheme();

export default function AddNewHomeWork({
  studentsList,
  addFx,
  closeDialog,
  modelState,
}) {
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(new Date());
  const [studentValue, setStudent] = React.useState(studentsList[0].id);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get("name"),
      desc: data.get("desc"),
      stid: data.get("select"),
      submit: value,
    });
    addFx({
      name: data.get("name"),
      desc: data.get("desc"),
      stid: data.get("select"),
      submit: value,
    });
  };

  return (
    <Dialog
      open={modelState}
      onClose={() => {
        console.log("im clsoing");
        closeDialog(false);
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Add New homework
          </Typography>
          {loading === true ? (
            <Image src={img.src} width={100} height={100} />
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="hw name"
                name="name"
                autoComplete="name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="desc"
                label=" hw description"
                type="text"
                id="desc"
              />
              {/* <TextField
                margin="normal"
                required
                fullWidth
                name="submitdate"
                type="date"
                id="submitdate"
              /> */}
              <Typography>select student :</Typography>
              <Select
                id="select"
                name="select"
                sx={{ marginBottom: "15px" }}
                required
                fullWidth
                value={studentValue}
                onChange={(item) => {
                  setStudent(item.target.value);
                }}
              >
                {studentsList.map((s) => {
                  return (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  );
                })}
              </Select>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  id="timepicker"
                  name="timepicker"
                  label="DateTimePicker"
                  required
                  fullWidth
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                />
              </LocalizationProvider>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                ADD
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Dialog>
  );
}

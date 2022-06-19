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
import helpers from "../helpers/helper";
import Loaderpage from "../components/loaderpage";
import { useState } from "react";
import Router from "next/router";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        HomeWorks system
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function TeacherSignIn() {
  const [isLoggedIn, setLogged] = useState(false);
  const [load, setLoad] = useState(true);
  const router = Router;

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    login({
      email: data.get("email"),
      password: data.get("password"),
    });
  };
  React.useEffect(() => {
    console.log("use effect worked ", load);
    preLoadCheck();
  }, []);
  async function preLoadCheck() {
    if (localStorage.getItem("tokens")) {
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const val = await helpers.checkJwt(tokens.token);
      console.log("user type ", tokens.type);
      if (val && tokens.type == "teacher") {
        // setLoad(false);
        // setLogged(true);
        router.replace("/teacherhome");
      } else {
        setLoad(false);
        setLogged(false);
        localStorage.removeItem("tokens");
      }
    } else {
      setLoad(false);
      setLogged(false);
    }
  }
  async function login({ email, password }) {
    console.log("fx taking ", email);
    try {
      const resp = await fetch(
        "https://aminexpress.herokuapp.com" + "/api/auth/teacher/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
          }),
          headers: {
            "content-type": "application/json ",
          },
        }
      );

      const res = await resp.json();
      console.log("response is = ", res);
      if (res.result == false) throw "not done sign in teacher";

      localStorage.setItem(
        "tokens",
        JSON.stringify({
          id: res.data.teacherId,
          token: res.data.token,
          type: "teacher",
        })
      );
      const dd = JSON.parse(localStorage.getItem("tokens"));
      router.replace("/teacherhome");

      console.log("fetch res = ", res);
    } catch (error) {
      console.log("fetch error", error);
    }
  }

  return load ? (
    <Loaderpage />
  ) : (
    <ThemeProvider theme={theme}>
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.success" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            TEACHER Sign in
          </Typography>
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In as teacher
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

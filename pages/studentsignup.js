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
import { AddBusinessTwoTone } from "@mui/icons-material";
import Router, { useRouter } from "next/router";
import Loaderpage from "../components/loaderpage";
import { useState } from "react";
import helpers from "../helpers/helper";

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
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const [load, setLoad] = useState(true);
  const router = Router;

  React.useEffect(() => {
    console.log("use effect worked ", load);
    preLoadCheck();
    // const tokens = JSON.parse(localStorage.getItem("tokens"));
    // if (tokens) {
    //   setLogged(true);
    // } else {
    //   setLogged(false);
    // }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      email: data.get("email"),
      password: data.get("password"),
      name: data.get("name"),
      grade: data.get("grade"),
    };
    console.log(values);
    if (
      data.get("email").trim().length > 4 &&
      data.get("password").trim().length > 4
    ) {
      signUp(values);
    } else {
      console.log("data is not enough in length");
    }
  };

  async function signUp({ email, password, name, grade }) {
    console.log("fx taking ", email);
    try {
      const resp = await fetch(
        "https://aminexpress.herokuapp.com" + "/api/auth/student/signup",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
            name: name,
            grade: grade,
          }),
          headers: {
            "content-type": "application/json ",
          },
        }
      );

      const res = await resp.json();

      if (res.result == false) {
        throw "error in sign up";
      }
      // localStorage.setItem(
      //   "tokens",
      //   JSON.stringify({
      //     id: res.data.userId,
      //     token: res.data.token,
      //     type: "student",
      //   })
      // );
      // const dd = JSON.parse(localStorage.getItem("tokens"));
      router.replace("/studentlogin");
    } catch (error) {
      console.log("fetch error", error);
    }
  }

  async function preLoadCheck() {
    if (localStorage.getItem("tokens")) {
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const val = await helpers.checkJwt(tokens.token);
      if (val && tokens.type == "student") {
        // setLoad(false);
        // setLogged(true);
        router.replace("/studenthome");
      } else {
        setLoad(false);
        // setLogged(false);
        localStorage.removeItem("tokens");
      }
    } else {
      setLoad(false);
      // setLogged(false);
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <AddBusinessTwoTone />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add New Student
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="name"
                  label="Name"
                  type="text"
                  id="name"
                  autoComplete="new-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="grade"
                  label="Grade"
                  type="number"
                  id="grade"
                  defaultValue={5}
                  autoComplete="new-grade"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register new Student
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

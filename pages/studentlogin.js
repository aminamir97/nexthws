import React, { useState } from "react";
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
import Router, { useRouter } from "next/router";
import helpers from "../helpers/helper";
import Loaderpage from "../components/loaderpage";

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

function StudentSignin(props) {
  const [isLoggedIn, setLogged] = useState(false);
  const [load, setLoad] = useState(true);

  const router = Router;
  React.useEffect(() => {
    console.log("use effect worked ", load);
    preLoadCheck();
  }, []);

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
        setLogged(false);
        localStorage.removeItem("tokens");
      }
    } else {
      setLoad(false);
      setLogged(false);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      data.get("email").trim().length > 4 &&
      data.get("password").trim().length > 4
    ) {
      loginStudent({
        email: data.get("email").trim(),
        password: data.get("password").trim(),
      });
    } else {
      console.log("not enough data", data.get("email").trim().length);
    }

    const ss = fetch("https://aminexpress.herokuapp.com" + "/amin").then(
      (res) => {
        console.log("im after cookie ");
      }
    );
  };

  async function loginStudent({ email, password }) {
    console.log("fx taking ", email);
    try {
      const resp = await fetch(
        "https://aminexpress.herokuapp.com" + "/api/auth/student/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
            amin: "new user",
          }),
          headers: {
            "content-type": "application/json ",
          },
        }
      );

      const res = await resp.json();
      localStorage.setItem(
        "tokens",
        JSON.stringify({
          id: res.data.userId,
          token: res.data.token,
          type: "student",
        })
      );
      const dd = JSON.parse(localStorage.getItem("tokens"));
      router.replace("/studenthome");
    } catch (error) {
      console.log("fetch error", error);
    }
  }
  //a
  return load == true ? (
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
          <Avatar sx={{ m: 1, bgcolor: "red" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            STUDENT Sign in
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
              Sign In as student
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

// This gets called on every request
// export async function getServerSideProps({ req }) {
//   if (req) {
//       console.log("initilals server");
//     const route = useRouter();
//     route.push("/");
//     // server
//     return { props: { storage: "render" } };
//   } else {
//     const route = useRouter();
//     route.push("/");
//     console.log("initilals");
//     localStorage.getItem("token");

//     return { props: { storage: "render" } };
//   }
//   // Pass data to the page via props
// }

// StudentSignin.getInitialProps = (req) => {
//   if (req) {
//     console.log("initilals server");
//     // server
//     return { page: {} };
//   } else {
//     console.log("initilals");
//     return { amin: 52 };
//   }
// };

export default StudentSignin;

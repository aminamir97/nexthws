import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { School } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import img from "../assets/loadinggif.gif";
import IconButton from "@mui/material/IconButton";
import Router, { useRouter } from "next/router";
import helpers from "../helpers/helper";
import Loaderpage from "../components/loaderpage";
import { useState } from "react";

const theme = createTheme();

export default function Album() {
  const router = Router;

  const [loading, setLoading] = React.useState(false);
  const [searchIndex, setIndex] = React.useState(0);
  const [tableData, setTbData] = React.useState([]);
  const [isLoggedIn, setLogged] = useState(false);
  const [initLoad, setLoad] = useState(true);

  React.useEffect(() => {
    preLoadCheck();
  }, []);

  function formatDate(date) {
    var hour = date.getHours();
    if (hour >= 12) {
      hour = "(" + hour + " pm)";
    } else {
      hour = "(" + hour + " am)";
    }
    return [date.getFullYear(), date.getMonth() + 1, date.getDate(), hour].join(
      "-"
    );
  }

  async function changeSearch(index) {
    if (index == searchIndex) return;
    setLoading(true);
    setIndex(index);

    try {
      if (localStorage.getItem("tokens")) {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        var link = "";
        const uid = tokens.id;
        if (index == 0) {
          link =
            "https://aminexpress.herokuapp.com" + "/api/student/gethws/" + uid;
        } else {
          link = "https://aminexpress.herokuapp.com" + "/api/student/gethws";
        }
        const resp = await fetch(link, {
          method: "GET",
          headers: {
            auth: tokens.token,
            "content-type": "application/json ",
          },
        });
        const result = await resp.json();
        console.log("resp = ", result);
        if (result.result == false) throw "result error";
        setTbData(result.data);
        setTimeout(() => {
          setLoading(false);
        }, "1500");
        const dd = new Date(result.data[0].created_at);
        console.log(dd);
      } else {
        throw "cant make request no auth";
      }
    } catch (error) {
      console.log("error in fetching ", error);
    }
  }

  async function logOut() {
    if (localStorage.getItem("tokens")) {
      localStorage.clear();
      router.replace("/studentlogin");
    } else {
      router.replace("/studentlogin");
    }
  }
  async function preLoadCheck() {
    if (localStorage.getItem("tokens")) {
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const val = await helpers.checkJwt(tokens.token);
      if (val && tokens.type == "student") {
        setLoad(false);
        setLogged(true);
        setIndex(0);
        changeSearch(0);
        // router.replace("/studenthome");
      } else {
        router.replace("/studentlogin");
        // setLoad(false);
        // setLogged(false);
      }
    } else {
      router.replace("/studentlogin");
      // setLoad(false);
      // setLogged(false);
    }
  }

  return initLoad ? (
    <Loaderpage />
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <School sx={{ mr: 2 }} />
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Student Home
            </Typography>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                logOut();
              }}
            >
              logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              HomeWorks List
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Here all the homeworks assigned in the system
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant={searchIndex === 0 ? "contained" : "outlined"}
                onClick={() => changeSearch(0)}
              >
                My Homeworks
              </Button>
              <Button
                variant={searchIndex === 1 ? "contained" : "outlined"}
                onClick={() => changeSearch(1)}
              >
                All Homeworks
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container
          sx={{ mx: "auto", py: 8, minHeight: "35vh", textAlign: "center" }}
          maxWidth="lg"
        >
          {loading === true ? (
            <Image src={img.src} width={100} height={100} />
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead sx={{ borderStyle: "solid", borderWidth: "2px" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}> NAME</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      DESCRIPTION
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {" "}
                      CREATED AT
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {" "}
                      SUBMIT AT
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      TEACHER NAME
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>
                        {formatDate(new Date(row.created_at))}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {formatDate(new Date(row.submit_date))}
                      </TableCell>
                      <TableCell>{row.tname}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}

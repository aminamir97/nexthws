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
import AddNewHomeWork from "../components/addnewform";
import Router, { useRouter } from "next/router";
import helpers from "../helpers/helper";
import Loaderpage from "../components/loaderpage";
import { useState } from "react";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const theme = createTheme();

export default function Album() {
  const [loading, setLoading] = React.useState(false);
  const [searchIndex, setIndex] = React.useState(0);
  const [students, setStudents] = useState([]);

  const [isLoggedIn, setLogged] = useState(false);
  const [load, setLoad] = useState(true);
  const [modelState, setModel] = useState(false);
  const [tableData, setTbData] = React.useState([]);

  const router = Router;

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
        getAllStudentsNames();
        getHws();
        // setLoad(false);
        // setLogged(true);
        //router.replace("/teacherlogin");
      } else {
        // setLoad(false);
        // setLogged(false);
        // localStorage.removeItem("tokens");
        router.replace("/teacherlogin");
      }
    } else {
      // setLoad(false);
      // setLogged(false);
      router.replace("/teacherlogin");
    }
  }
  function handleModel(openState) {
    setModel(openState);
  }

  async function getHws() {
    setLoading(true);

    try {
      if (localStorage.getItem("tokens")) {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        var link = "";
        const uid = tokens.id;
        link =
          "https://aminexpress.herokuapp.com" + "/api/teacher/gethws/" + uid;

        const resp = await fetch(link, {
          method: "GET",
          headers: {
            auth: tokens.token,
            "content-type": "application/json ",
          },
        });
        const result = await resp.json();
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

  async function addNewHomework({ name, desc, stid, submit }) {
    console.log(name, desc, stid, submit);
    const datenow = new Date();
    ///api/teacher/addhw/:tid

    try {
      if (localStorage.getItem("tokens")) {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const val = await helpers.checkJwt(tokens.token);
        const tid = tokens.id;
        const resp = await fetch(
          "https://aminexpress.herokuapp.com" + "/api/teacher/addhw/" + tid,
          {
            method: "POST",
            body: JSON.stringify({
              //name, desc, submit_date, foruserid
              name: name,
              desc: desc,
              submit_date: submit,
              foruserid: stid,
            }),
            headers: {
              auth: tokens.token,
              "content-type": "application/json ",
            },
          }
        );
        const result = await resp.json();
        if (result.result == false) throw "result error";
        handleModel(false);
        getHws();
        const dd = result;
        console.log(dd);
      } else {
      }
    } catch (err) {
      console.log("error , ", err);
    }
  }
  async function logOut() {
    if (localStorage.getItem("tokens")) {
      localStorage.clear();
      router.replace("/teacherlogin");
    } else {
      router.replace("/teacherlogin");
    }
  }

  async function getAllStudentsNames() {
    try {
      if (localStorage.getItem("tokens")) {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        var link =
          "https://aminexpress.herokuapp.com" + "/api/student/getAllStudents";

        const resp = await fetch(link, {
          method: "GET",
          headers: {
            auth: tokens.token,
            "content-type": "application/json ",
          },
        });
        const result = await resp.json();
        if (result.result == false) throw "result error";
        setStudents(result.data);
        setTimeout(() => {
          setLoading(false);
        }, "1500");
        setLoad(false);
        setLogged(true);
        const dd = result;
        console.log(dd);
      } else {
        throw "cant make request no auth";
      }
    } catch (error) {
      console.log("error in fetching ", error);
    }
  }

  function changeSearch(index) {
    setIndex(index);
    if (index == 1) setLoading(true);
    else setLoading(false);
  }
  async function deleteHw(hwid) {
    setLoading(true);
    try {
      if (localStorage.getItem("tokens")) {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        var link = "";
        const uid = tokens.id;
        link =
          "https://aminexpress.herokuapp.com" + "/api/teacher/deletehw/" + hwid;

        const resp = await fetch(link, {
          method: "DELETE",
          headers: {
            auth: tokens.token,
            "content-type": "application/json ",
          },
        });
        const result = await resp.json();
        if (result.result == false) throw "result error";

        setTimeout(() => {
          setLoading(false);
        }, "1500");
        getHws();
      } else {
        throw "cant make request no auth";
      }
    } catch (error) {
      console.log("error in fetching ", error);
    }
  }
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

  return load ? (
    <Loaderpage />
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {modelState && (
        <AddNewHomeWork
          addFx={addNewHomework}
          studentsList={students}
          modelState={modelState}
          closeDialog={handleModel}
        />
      )}

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
              Teacher Home
            </Typography>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                // router.push("/studentsignup");
                logOut();
              }}
            >
              logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <main>
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
              HomeWorks List by Teacher
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Here all the homeworks submitted by this teacher
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" onClick={() => handleModel(true)}>
                Add New HomeWork
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container
          sx={{ py: 8, minHeight: "35vh", textAlign: "center" }}
          maxWidth="ld"
        >
          {loading === true ? (
            <Image src={img.src} width={100} height={100} />
          ) : (
            <TableContainer
              component={Paper}
              sx={{ minWidth: 700, maxWidth: "100%" }}
            >
              <Table
                sx={{ minWidth: 700, maxWidth: "100%" }}
                aria-label="customized table"
              >
                <TableHead
                  sx={{
                    borderStyle: "solid",
                    borderWidth: "2px",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>id</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}> name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      description
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {" "}
                      created at
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {" "}
                      submit at
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      student name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ACTIONS</TableCell>
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
                      <TableCell>{row.sname}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ m: 0.2 }}
                          onClick={() => {
                            deleteHw(row.id);
                          }}
                        >
                          delete
                        </Button>
                      </TableCell>
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
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}

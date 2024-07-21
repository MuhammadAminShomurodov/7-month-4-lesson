import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems } from "./mainListItems";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import AddStudent from "./AddTeachers";
import EditStudent from "./EditTeachers";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import "./Students.css";
import { useNavigate } from "react-router-dom";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

const Students = () => {
  const [open, setOpen] = React.useState(true);
  const [teachers, setTeachers] = React.useState([]);
  const [editOpen, setEditOpen] = React.useState(false);
  const [currentTeacher, setCurrentTeacher] = React.useState(null);
  const [filterGroup, setFilterGroup] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [teacherToDelete, setTeacherToDelete] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("Fetching teachers data...");
    fetch("http://localhost:3000/teachers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data fetched successfully:", data);
        setTeachers(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleAddTeacher = (newTeacher) => {
    fetch("http://localhost:3000/teachers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTeacher),
    })
      .then((response) => response.json())
      .then((addedTeacher) => {
        setTeachers((prevTeachers) => [...prevTeachers, addedTeacher]);
      })
      .catch((error) => {
        console.error("Error adding teacher:", error);
      });
  };

  const handleEditTeacher = (updatedTeacher) => {
    fetch(`http://localhost:3000/teachers/${updatedTeacher.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTeacher),
    })
      .then((response) => response.json())
      .then((editedTeacher) => {
        setTeachers((prevTeachers) =>
          prevTeachers.map((teacher) =>
            teacher.id === editedTeacher.id ? editedTeacher : teacher
          )
        );
      })
      .catch((error) => {
        console.error("Error editing teacher:", error);
      });
  };

  const handleDeleteTeacher = (id) => {
    fetch(`http://localhost:3000/teachers/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTeachers((prevTeachers) =>
          prevTeachers.filter((teacher) => teacher.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting teacher:", error);
      });
  };

  const handleEditClick = (teacher) => {
    setCurrentTeacher(teacher);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentTeacher(null);
  };

  const handleFilterChange = (event) => {
    setFilterGroup(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesGroup = filterGroup ? teacher.group === filterGroup : true;
    const term = searchTerm.toLowerCase();
    const matchesFirstname = teacher.firstName.toLowerCase().includes(term);
    const matchesLastname = teacher.lastName.toLowerCase().includes(term);
    return matchesGroup && (matchesFirstname || matchesLastname);
  });

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const openDeleteDialog = (teacher) => {
    setTeacherToDelete(teacher);
    setConfirmDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setTeacherToDelete(null);
    setConfirmDeleteOpen(false);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      handleDeleteTeacher(teacherToDelete.id);
    }
    closeDeleteDialog();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Teachers
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              <MeetingRoomIcon />
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">{mainListItems}</List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <AddStudent onAdd={handleAddTeacher} />
                  <TextField
                    fullWidth
                    label="Search by First or Last Name"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                    <InputLabel id="group-filter-label">
                      Filter by Group
                    </InputLabel>
                    <Select
                      labelId="group-filter-label"
                      value={filterGroup}
                      label="Filter by Group"
                      onChange={handleFilterChange}
                      className="select-all"
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      <MenuItem value="Group 1">Group 1</MenuItem>
                      <MenuItem value="Group 2">Group 2</MenuItem>
                      <MenuItem value="Group 3">Group 3</MenuItem>
                    </Select>
                  </FormControl>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>First name</TableCell>
                          <TableCell>Last name</TableCell>
                          <TableCell>Group</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTeachers.map((teacher) => (
                          <TableRow
                            key={teacher.id}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {teacher.id}
                            </TableCell>
                            <TableCell>{teacher.firstName}</TableCell>
                            <TableCell>{teacher.lastName}</TableCell>
                            <TableCell>{teacher.group}</TableCell>
                            <TableCell align="right">
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEditClick(teacher)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => openDeleteDialog(teacher)}
                                sx={{ ml: 1 }}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      {currentTeacher && (
        <EditStudent
          open={editOpen}
          handleClose={handleEditClose}
          student={currentTeacher}
          onEdit={handleEditTeacher}
        />
      )}
      <Dialog
        open={confirmDeleteOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="confirm-delete-dialog"
      >
        <DialogTitle id="confirm-delete-dialog">Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this teacher?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Students;

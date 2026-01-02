import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Box,
  Grid,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const DashboardPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://mailbackend.teamgrid.io/api/admin/contacts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setContacts(res.data.data);
        } else {
          setError("Failed to fetch contacts");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch contacts.");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  console.log(contacts);
  

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ mt: 0, px: { xs: 2.5, md: 3, lg: 4, xl: 8 } }}
      width="100%"
    >
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ pt: 4 }}
      >
        <Grid item xs={12} sm={8}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            gutterBottom
            fontWeight={600}
          >
            Welcome, Admin!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Here are your latest contact requests.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} textAlign={isMobile ? "left" : "right"}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            sx={{ mt: isMobile ? 1 : 0 }}
          >
            Logout
          </Button>
        </Grid>
      </Grid>
      {loading ? (
        <CircularProgress
          sx={{ mt: 4, px: { xs: 2.5, md: 3, lg: 4, xl: 8 } }}
        />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      ) : (
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            mb: 5,
            p: { xs: 1, sm: 2 },
            boxShadow: 4,
            borderRadius: 2,
            width: "100%",
          }}
        >
          <TableContainer>
            <Table size={isMobile ? "small" : "medium"} stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
                  <TableCell sx={{ fontWeight: 600 }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Work Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type of Query</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>From Page</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Attachments</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      backgroundColor:
                        idx % 2 === 0 ? theme.palette.action.hover : "inherit",
                      "&:hover": {
                        backgroundColor: theme.palette.action.selected,
                      },
                    }}
                  >
                    <TableCell>{contact.fullName}</TableCell>
                    <TableCell>{contact.workEmail}</TableCell>
                    <TableCell>{contact.company || "-"}</TableCell>
                    <TableCell>{contact.typeofQuery || "-"}</TableCell>
                    <TableCell>{contact.fromPage || "-"}</TableCell>
                    <TableCell>{contact.message}</TableCell>
                    <TableCell>
                      {contact.attachments && contact.attachments.length > 0
                        ? contact.attachments.map((a, i) => (
                            <a
                              key={i}
                              href={
                                a.startsWith("http")
                                  ? a
                                  : `https://mailbackend.teamgrid.io/${a}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                marginRight: 8,
                              }}
                            >
                              File {i + 1}
                            </a>
                          ))
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {contact.createdAt
                        ? new Date(contact.createdAt).toLocaleString()
                        : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default DashboardPage;

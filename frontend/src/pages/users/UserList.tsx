import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  CircularProgress,
  Typography,
  Avatar,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getUsersAPI, deleteUserAPI } from "../../services/user.api";
import type { User } from "../../types/user";
import ConfirmDialog from "../../components/ConfirmDialog";
import PageHeader from "../../components/PageHeader";

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsersAPI();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id: string) => navigate(`/users/edit/${id}`);

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserAPI(userToDelete);
        fetchUsers();
      } catch (err) {
        console.error("Delete failed", err);
      } finally {
        setConfirmOpen(false);
        setUserToDelete(null);
      }
    }
  };

  // Helper: generate avatar initials
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  // Helper: avatar color from name
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 60%, 45%)`;
  };

  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={3}>
      <PageHeader
        title="User Management"
        buttonText="Add User"
        buttonLink="/users/new"
      />

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
          <TableContainer sx={{ maxHeight: 640 }}>
            <Table stickyHeader aria-label="user table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Registered On</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">
                        No registered users found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      hover
                      key={user._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar
                            sx={{
                              bgcolor: stringToColor(user.name),
                              width: 36,
                              height: 36,
                              fontSize: 14,
                            }}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium">
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEdit(user._id!)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(user._id!)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </Box>
  );
}

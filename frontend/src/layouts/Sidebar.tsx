import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { navConfig } from "../routes/paths";
import React from "react";

const drawerWidth = 300;


export default function Sidebar() {
  const { pathname } = useLocation();

  const drawerContent = (
    <div>
      <Toolbar sx={{ justifyContent: "center" }}>
      </Toolbar>
      <List>
        {navConfig.map(
          (item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={pathname.startsWith(item.path)}
                >
                  <ListItemIcon>{React.createElement(item.icon)}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            )
        )}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

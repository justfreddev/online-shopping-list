import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import "./ShoppingList.css";

const ShoppingList = (props) => {
  return (
    <>
      <Typography
        variant="h6"
        sx={{ mb: 1, color: "#5f6368", fontWeight: 500, textAlign: "center" }}
      >
        Your Items
      </Typography>
      <List sx={{ width: "100%" }}>
        {props.list.length === 0 ? (
          <ListItem>
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Typography
                sx={{
                  color: "#5f6368",
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                No items yet
              </Typography>
            </Box>
          </ListItem>
        ) : (
          props.list.map((item, index) => (
            <div key={index}>
              <ListItem
                key={index}
                disablePadding
                sx={{
                  py: 1,
                  justifyContent: "center",
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => props.handleDelete(index)}
                    sx={{ color: "#5f6368" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Box
                  sx={{
                    ml: 1,
                    mr: 7,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#202124",
                      textAlign: "center",
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              </ListItem>
              {index < props.list.length - 1 && (
                <Divider variant="fullWidth" component="li" />
              )}
            </div>
          ))
        )}
      </List>
    </>
  );
};

export default ShoppingList;

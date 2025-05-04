import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const ShoppingList = (props) => {
  // Handle case when props.list is undefined or not an array
  const list = Array.isArray(props.list) ? props.list : [];

  return (
    <List>
      {list.length === 0 ? (
        <ListItem>
          <ListItemText
            primary="No items yet"
            sx={{ textAlign: "center", fontStyle: "italic" }}
          />
        </ListItem>
      ) : (
        list.map((item, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => props.handleDelete(index)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={item} />
          </ListItem>
        ))
      )}
    </List>
  );
};

export default ShoppingList;

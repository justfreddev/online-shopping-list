import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const ShoppingList = (props) => {
  return (
    <List>
      {props.list.map((item, index) => (
        <ListItem
          key={index}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => props.handleDelete(item)}
            >
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );
};

export default ShoppingList;

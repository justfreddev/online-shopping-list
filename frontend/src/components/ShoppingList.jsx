import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import "./ShoppingList.css";

const ShoppingList = (props) => {
  const [localQuantities, setLocalQuantities] = useState({});

  useEffect(() => {
    setLocalQuantities({});
  }, [props.list.length]);

  function validateQuantity(value, index) {
    if (!props.validateQuantity(value)) {
      props.setQuantityErrors({
        ...props.quantityErrors,
        [index]: "Invalid quantity",
      });
      return false;
    }

    clearErrorDisplayAtIndex(index);
    return true;
  }

  function clearErrorDisplayAtIndex(index) {
    const newErrors = { ...props.quantityErrors };
    delete newErrors[index];
    props.setQuantityErrors(newErrors);
  }

  return (
    <>
      <Typography
        variant="h6"
        sx={{ mb: 1, color: "#5f6368", fontWeight: 500, textAlign: "center" }}
      >
        Your Items
      </Typography>
      <List sx={{ width: "100%" }}>
        {
          // Only renders when there are no items in the shopping list
          props.list.length === 0 ? (
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
            // Only renders when there is at least one item in the shopping list
            props.list.map((item, index) => (
              <div key={index}>
                <ListItem
                  disablePadding
                  sx={{
                    py: 1,
                    justifyContent: "center",
                    position: "relative",
                    minHeight: "56px",
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        props.handleDelete(index);
                        clearErrorDisplayAtIndex(index);
                      }}
                      sx={{
                        color: "#5f6368",
                        position: "absolute",
                        top: "50%",
                        right: 8,
                        transform: "translateY(-50%)",
                      }}
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "left",
                      gap: "20px",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <TextField
                        variant="outlined"
                        type="number"
                        value={
                          // Display local quantity if it exists,
                          // otherwise use the saved quantity from props,
                          // or default to 1 if no quantity is available (shouldn't happen)
                          localQuantities[index] !== undefined
                            ? localQuantities[index]
                            : props.quantities?.[index] || 1
                        }
                        helperText={props.quantityErrors[index]}
                        error={!!props.quantityErrors[index]}
                        sx={{
                          width: "75px",
                          "& .MuiOutlinedInput-root": {
                            height: "40px",
                          },
                          "& .MuiFormHelperText-root": {
                            top: "100%",
                            marginTop: "2px",
                          },
                        }}
                        onChange={(e) => {
                          setLocalQuantities({
                            ...localQuantities,
                            [index]: e.target.value,
                          });

                          if (validateQuantity(e.target.value, index)) {
                            props.updateQuantity(
                              index,
                              parseInt(e.target.value)
                            );
                          }
                        }}
                        onBlur={(e) => {
                          if (validateQuantity(e.target.value, index)) {
                            // Once an input turns invalid --> valid, remove its error message
                            setLocalQuantities((prev) => {
                              const newLocalQuantities = { ...prev };
                              delete newLocalQuantities[index];
                              return newLocalQuantities;
                            });
                          } else {
                            e.target.focus();
                          }
                        }}
                      />
                    </div>
                    <Typography
                      className={`item-text ${props.checkedItems[index] ? 'checked' : ''}`}
                      sx={{
                        color: "#202124",
                        textAlign: "center",
                      }}
                    >
                      {item}
                    </Typography>
                    <Checkbox 
                      checked={!!props.checkedItems[index]} 
                      onChange={() => props.toggleItemChecked(index)}
                      sx={{ color: "#5f6368" }}
                    />
                  </Box>
                </ListItem>
                {
                  // Only renders when there is more than one item in the shopping list
                  index < props.list.length - 1 && (
                    <Divider variant="fullWidth" component="li" />
                  )
                }
              </div>
            ))
          )
        }
      </List>
    </>
  );
};

export default ShoppingList;

import React from "react";
import FormatAlignJustifyIcon from "@material-ui/icons/FormatAlignJustify";
import AppsIcon from "@material-ui/icons/Apps";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import { MyFormControlForView } from "./styledComponent";

interface props {
  view: string;
  setView: Function;
}

const ViewSelector: React.FC<props> = ({ view, setView }) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setView(event.target.value as string);
  };
  return (
    <MyFormControlForView variant="outlined">
      <InputLabel>View</InputLabel>
      <Select
        value={view}
        onChange={handleChange}
        label="View"
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          getContentAnchorEl: null,
        }}
      >
        <MenuItem value="gallery">
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          Gallery
        </MenuItem>
        <MenuItem value="list">
          <ListItemIcon>
            <FormatAlignJustifyIcon />
          </ListItemIcon>
          List
        </MenuItem>
      </Select>
    </MyFormControlForView>
  );
};

export default ViewSelector;

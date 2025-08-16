"use client";

import React, { useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { appWidth } from "./config"

export default function Headerbar({ setSearchText, uploadFile } : { setSearchText: any; uploadFile: any }) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="headerBar" style={styles.headerBar}>
      <TextField
        id="outlined-basic"
        label="Search images..."
        type="search"
        variant="filled"
        onChange={(e) => setSearchText(e.target.value)}
      />
      {/* <Input type="file" accept="image/*"/> */}

      <input
        ref={inputFileRef}
        type="file"
        accept="image/*"
        // hide the input and simulate click via the mui button.
        // This way, we can customize the button closer to the
        // design requirements
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const file: File = e.target.files?.[0];
            console.log(file);
            uploadFile(file);
          } else {
            console.error("issue uploading file");
          }
        }}
      />
      <Button
        onClick={() => {
          inputFileRef.current?.click();
        }}
        variant="contained"
      >
        Upload
      </Button>
    </div>
  );
}

const styles = {
  headerBar: {
    paddingBottom: "20px",
    width: appWidth,
    display: "flex",
    justifyContent: "space-between",
  },
};

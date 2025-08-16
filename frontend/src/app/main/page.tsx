"use client";

import React, { useEffect, useState, useRef } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { backendUrl } from "./config";
import { imageObject } from "./objects";
import { Input } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function page() {
  const [allItemData, setAllItemData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [numberOfImages, setNumberOfImages] = useState(0);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const fetchAndUpdateAllImageData = () => {
    fetch(`${backendUrl}/imagesAll`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAllItemData(data);
        setFilteredData(data);
        setNumberOfImages(data.length);
      })
      .catch((error) => console.error("Error:", error));
  }

  useEffect(() => {
    console.log("starting fetch");
    fetchAndUpdateAllImageData();
  }, []);

  useEffect(() => {
    console.log("searchText", searchText);
    // filter by input text, ignore case. Note: g isn't necessary since filter handels iteration.
    const re = new RegExp(searchText, "gi");

    let localFilteredData = allItemData.filter((item: imageObject) => {
      if (searchText === "") {
        return true;
      }
      return item.title.match(re);
    });
    setNumberOfImages(localFilteredData.length);
    console.log("localFilteredData", localFilteredData);
    setFilteredData(localFilteredData);
  }, [searchText]);

  const uploadFile = (inputFile: File) => {
    console.log("uploading: ", inputFile);

    const formData = new FormData();
    formData.append("file", inputFile);

    fetch(`${backendUrl}/upload`, {
      method: "POST",
      // body: JSON.stringify({ file: inputFile }),
      body: formData,
    }).then((response) => {
      // if response is 200, fetch all images to refresh ImageList
      if (response.ok) {
        fetchAndUpdateAllImageData();
      } else {
        console.error("Error uploading file");
      }
    });
  };

  const deletePicture = (imgUrl: string) => {
    console.log("begining delete :", imgUrl);

    fetch(`${backendUrl}/removeImg/${imgUrl}`, {
      method: "DELETE",
    })
    .then((response) => {
      // if response is 200, fetch all images to refresh ImageList
      if (response.ok) {
        fetchAndUpdateAllImageData();
      } else {
        console.error("Error uploading file");
      }
    });
  };

  return (
    <div className="main" style={styles.main}>
      <div className="container" style={styles.container}>
        <div className="headerBar" style={styles.headerBar}>
          <TextField
            id="outlined-basic"
            label="Search images"
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
        <div>
          <ImageList sx={styles.imageList}>
            <ImageListItem key="Subheader" cols={2}>
              <ListSubheader component="div">
                {numberOfImages} pictures retrieved{" "}
              </ListSubheader>
            </ImageListItem>
            {filteredData.map((item: imageObject) => (
              <ImageListItem key={item.img}>
                <img
                  srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=248&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.title}
                  // subtitle={item.author}
                  actionIcon={
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                      aria-label={`info about ${item.title}`}
                      onClick={() => {
                        // console.log(`${item.title} has been clicked`);
                        deletePicture(item.title);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>
    </div>
  );
}

const appWidth = "70vw";

const styles = {
  main: {
    width: "100vw",
    height: "100vh",
    // backgroundColor: "#000000ff",
    backgroundColor: "#f0f0f0",
  },
  container: {
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    // width: appWidth,
  } as const,
  imageList: {
    width: appWidth,
    height: "70vh",
  },
  headerBar: {
    paddingBottom: "20px",
    width: appWidth,
    display: "flex",
    justifyContent: "space-between",
  },
};

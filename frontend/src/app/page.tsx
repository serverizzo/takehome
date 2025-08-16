"use client";

import React, { useEffect, useState, useRef } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import { backendUrl } from "./pageDependencies/config";
import { ImageObject } from "./pageDependencies/objects";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Headerbar from "./pageDependencies/headerbar";
import { appWidth } from "./pageDependencies/config";
import Alert from "@mui/material/Alert";

export default function Page() {
  const [allItemData, setAllItemData] = useState<ImageObject[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<ImageObject[]>([]);
  const [numberOfImages, setNumberOfImages] = useState(0);

  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const fetchAndUpdateAllImageData = () => {
    fetch(`${backendUrl}/imagesAll`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setAllItemData(data);
        setFilteredData(data);
        setNumberOfImages(data.length);
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    // console.log("starting fetch");
    fetchAndUpdateAllImageData();
  }, []);

  useEffect(() => {
    // console.log("searchText", searchText);
    // filter by input text, ignore case. Note: g isn't necessary since filter handels iteration.
    const re = new RegExp(searchText, "gi");

    let localFilteredData:ImageObject[] = allItemData.filter((item: ImageObject) => {
      if (searchText === "") {
        return true;
      }
      return item.title.match(re);
    });
    setNumberOfImages(localFilteredData.length);
    // console.log("localFilteredData", localFilteredData);
    setFilteredData(localFilteredData);
  }, [searchText]);

  const uploadFile = (inputFile: File) => {
    // console.log("uploading: ", inputFile);

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
    }).catch((error) => {
      console.log("error uploading file", error)
    });
  };

  const deletePicture = (imgUrl: string) => {
    // console.log("begining delete :", imgUrl);

    fetch(`${backendUrl}/removeImg/${imgUrl}`, {
      method: "DELETE",
    }).then((response) => {
      // if response is 200, fetch all images to refresh ImageList
      if (response.ok) {
        fetchAndUpdateAllImageData();
      } else {
        console.error("Error uploading file");
      }
    }).catch((error) => {
      console.log("error deleting file", error)
    });
  };

  const handelSnackbarErrorClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenErrorSnackbar(false);
  };

  return (
    <div className="main" style={styles.main}>
      <div className="container" style={styles.container}>
        <Headerbar
          setSearchText={setSearchText}
          uploadFile={uploadFile}
          setOpenErrorSnackbar={setOpenErrorSnackbar}
        />
        <div>
          <ImageList sx={styles.imageList}>
            <ImageListItem key="Subheader" cols={2}>
              <ListSubheader component="div">
                {numberOfImages} pictures retrieved
              </ListSubheader>
            </ImageListItem>
            {filteredData.map((item: ImageObject) => (
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
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={7000} // 7 seconds
        onClose={handelSnackbarErrorClose}
        // message="File upload failed, uploaded file was not an image"
        // action={action}
      >
        <Alert severity="warning">
          File upload failed, uploaded file was not an image
        </Alert>
      </Snackbar>
    </div>
  );
}

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

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port
const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.use(cors())
// Make uploads available to the frontend for img urls.
app.use(express.static(path.join(__dirname, 'uploads')));

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where uploaded files will be stored
    // Make sure this 'uploads' directory exists
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    // Use the original filename to save the file
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get('/imagesAll', (req, res) =>{
    
//     const data = [
//     {
//         img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
//         title: "Breakfast",
//         author: "@bkristastucchio",
//         rows: 2,
//         cols: 2,
//         featured: true,
//     },
//     {
//         img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
//         title: "Burger",
//         author: "@rollelflex_graphy726",
//     },
//     {
//         img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
//         title: "Camera",
//         author: "@helloimnik",
//     },
//     {
//         img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
//         title: "Coffee",
//         author: "@nolanissac",
//         cols: 2,
//     },
//     {
//         img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
//         title: "Hats",
//         author: "@hjrc33",
//         cols: 2,
//     },
//     {
//         img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
//         title: "Honey",
//         author: "@arwinneil",
//         rows: 2,
//         cols: 2,
//         featured: true,
//     },
//     {
//         img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
//         title: "Basketball",
//         author: "@tjdragotta",
//     },
//     {
//         img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
//         title: "Fern",
//         author: "@katie_wasserman",
//     },
//     {
//         img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
//         title: "Mushrooms",
//         author: "@silverdalex",
//         rows: 2,
//         cols: 2,
//     },
//     {
//         img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
//         title: "Tomato basil",
//         author: "@shelleypauls",
//     },
//     {
//         img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
//         title: "Sea star",
//         author: "@peterlaster",
//     },
//     {
//         img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
//         title: "Bike",
//         author: "@southside_customs",
//         cols: 2,
//     }
// ]   

    const uploadDir = path.join(__dirname, 'uploads');

    let toReturn = [];

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return console.error('Unable to scan directory: ' + err);
        }


        files.forEach(file => {
            const filePath = path.join(uploadDir, file);
            console.log(file);
            toReturn.push({
                img: `http://localhost:3001/${file}`,
                title: file
            })
        });

        console.log("toReturn: ", toReturn);
        return res.json(toReturn)
    });

    // res.json(data)
})

app.post('/upload', upload.single('file'), (req, res) => {
  console.log("Endpoint hit");
  
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // The file information is now available on req.file
  console.log("File received:", req.file);
  console.log("File name:", req.file.originalname);

  res.status(200).send("File uploaded successfully!");
});
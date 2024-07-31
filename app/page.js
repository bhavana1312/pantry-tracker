"use client";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  InputAdornment,
} from "@mui/material";
import { firestore } from "./firebase";
import {
  collection,
  getDocs,
  query,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add"; // Add icon for Add button
import DeleteIcon from "@mui/icons-material/Delete"; // Add icon for Delete button
import SearchIcon from "@mui/icons-material/Search"; // Search icon

const styles = {
  mainContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    bgcolor: "#e8f5e9", // Updated background color
    gap: 2,
    fontFamily: "Arial, sans-serif",
    padding: "16px",
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#ffffff",
    border: "2px solid #6200ea",
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  pantryBox: {
    width: "800px",
    height: "400px",
    overflowY: "auto",
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "16px",
    bgcolor: "#ffffff",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    },
    "&::-webkit-scrollbar": {
      width: "12px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f0f0f0",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888",
      borderRadius: "10px",
      border: "3px solid #f0f0f0",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#555",
    },
  },
  itemBox: {
    width: "100%",
    height: "80px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    bgcolor: "#e0f7fa",
    borderRadius: "8px",
    paddingX: 4,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
    marginBottom: "15px",
    "&:hover": {
      backgroundColor: "#b2ebf2",
    },
  },
  button: {
    backgroundColor: "#ff6f61",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#ff4a4a",
    },
  },
  deleteButton: {
    backgroundColor: "#ff1744",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#c81032",
    },
  },
  searchField: {
    "& .MuiOutlinedInput-root": {
      width:"300px",
      borderRadius: "50px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      transition: "box-shadow 0.3s ease",
      "&:hover": {
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
      "&.Mui-focused": {
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
    },
    "& .MuiInputAdornment-root": {
      color: "#888",
    },
  },
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState("");
  const [itemCount, setItemCount] = useState(1); // Added state for item quantity
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search query

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry-items"));
    const docs = await getDocs(snapshot);
    const pantryList = [];

    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
    setFilteredPantry(pantryList); // Initialize filtered pantry
  };

  useEffect(() => {
    updatePantry();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredPantry(pantry);
    } else {
      setFilteredPantry(
        pantry.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, pantry]);

  const addItem = async (item, count) => {
    const docRef = doc(collection(firestore, "pantry-items"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentCount = docSnap.data().count || 0;
      await setDoc(docRef, { count: currentCount + count });
    } else {
      await setDoc(docRef, { count: count });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry-items"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const count = docSnap.data().count;
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
      await updatePantry();
    }
  };

  return (
    <Box sx={styles.mainContainer}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-basic-count"
              label="Quantity"
              variant="outlined"
              type="number"
              value={itemCount}
              onChange={(e) => setItemCount(parseInt(e.target.value, 10))}
            />
            <Button
              variant="contained"
              sx={styles.button}
              onClick={() => {
                addItem(itemName, itemCount);
                setItemName("");
                setItemCount(1);
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack width="100%" justifyContent="center" alignItems="center" mb={2}>
  <TextField
    id="search-field"
    label="Search"
    variant="outlined"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
    sx={{ ...styles.searchField, width: "300px" }} 
  />
</Stack>

    
      <Button
        variant="contained"
        sx={styles.button}
        onClick={handleOpen}
        startIcon={<AddIcon />}
      >
        Add Item
      </Button>
      <Stack sx={styles.pantryBox}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Pantry Items
        </Typography>
        {filteredPantry.map((item) => (
          <Box key={item.name} sx={styles.itemBox}>
            <Typography variant="h6" color="textPrimary">
              {item.name}
            </Typography>
            <Typography variant="h6" color="textPrimary">
              Quantity: {item.count}
            </Typography>
            <Button
              variant="contained"
              sx={styles.deleteButton}
              startIcon={<DeleteIcon />}
              onClick={() => removeItem(item.name)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

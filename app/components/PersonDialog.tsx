//'use client'

import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Person } from "../lib/person";

interface PersonDialogProps {
  open: boolean;
  handleClose: () => void;
  currentPerson: Person | null;
  setCurrentPerson: React.Dispatch<React.SetStateAction<Person | null>>;
  handleSubmit: () => void;
}

const PersonDialog: React.FC<PersonDialogProps> = ({
  open,
  handleClose,
  currentPerson,
  setCurrentPerson,
  handleSubmit,
}) => {
  const isAddMode:boolean = !!currentPerson?.id;
  return (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>{isAddMode ? "Edit Person" : "Add Person"}</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="First Name"
        fullWidth
        value={currentPerson?.firstname || ""}
        onChange={(e) =>
          setCurrentPerson((prev) => ({ ...prev!, firstname: e.target.value }))
        }
      />
      <TextField
        margin="dense"
        label="Last Name"
        fullWidth
        value={currentPerson?.lastname || ""}
        onChange={(e) =>
          setCurrentPerson((prev) => ({ ...prev!, lastname: e.target.value }))
        }
      />
      <TextField
        margin="dense"
        label="Phone"
        fullWidth
        value={currentPerson?.phone || ""}
        onChange={(e) =>
          setCurrentPerson((prev) => ({ ...prev!, phone: e.target.value }))
        }
      />
      <DatePicker
        slotProps={{
          textField: {
            error: false
          },
        }} 
        format="DD / MM / YYYY"
        value={dayjs(currentPerson?.date_of_birth || "")} 
        disableFuture
        onChange={(value) =>
          setCurrentPerson((prev) => ({ ...prev!, date_of_birth: dayjs(value).toISOString() }))
        }
        className="w-100 mt-8"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleSubmit} color="primary">
        {isAddMode ? "Update" : "Add"}
      </Button>
    </DialogActions>
  </Dialog>
)};

export default PersonDialog;

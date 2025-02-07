import React, { useState } from "react";
import {
  Dropdown,
  Input,
  Label,
  Button,
  Checkbox,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  makeStyles
} from "@fluentui/react-components";
import { ChevronDown16Filled, Info16Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  timesheetContainer: {
    fontFamily: '"Segoe UI", sans-serif',
    maxWidth: "1200px",
    margin: "0 auto"
  },
  timeInputSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    marginBottom: "20px"
  },
  quickEntry: {
    width: "100px"
  },
  projectSection: {
    marginBottom: "20px"
  },
  taskRow: {
    "&:hover": {
      backgroundColor: "#f5f5f5"
    }
  },
  timeInput: {
    width: "60px",
    textAlign: "center"
  },
  dayHeader: {
    textAlign: "center",
    fontWeight: "bold"
  },
  totalTime: {
    fontSize: "1.2em",
    fontWeight: "bold",
    textAlign: "center"
  }
});

const Section = () => {
  const styles = useStyles();
  const [quickEntry, setQuickEntry] = useState("00:00");

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const dates = [
    "20 NOV, 2023",
    "21 NOV, 2023",
    "22 NOV, 2023",
    "23 NOV, 2023",
    "24 NOV, 2023",
    "25 NOV, 2023",
    "26 NOV, 2023"
  ];

  return (
    <div className={styles.timesheetContainer}>
      <div className={styles.timeInputSection}>
        <div>
          <Label>From Time</Label>
          <Dropdown placeholder="Hr" />
          <Dropdown placeholder="Min" />
        </div>
        <div>
          <Label>To Time</Label>
          <Dropdown placeholder="Hr" />
          <Dropdown placeholder="Min" />
        </div>
        <div>
          <Label>Quick Entry</Label>
          <Input
            className={styles.quickEntry}
            value={quickEntry}
            onChange={(e, data) => setQuickEntry(data.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Project / Task</TableCell>
            {days.map((day, index) => (
              <TableCell key={day} className={styles.dayHeader}>
                <div>{day}</div>
                <div>{dates[index]}</div>
                <div>08:30 AM - 06:00 PM</div>
                <div className={styles.totalTime}>8:30</div>
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Button icon={<ChevronDown16Filled />} iconPosition="after">
                Project 1
              </Button>
            </TableCell>
            {days.map((day) => (
              <TableCell key={day} />
            ))}
          </TableRow>
          <TableRow className={styles.taskRow}>
            <TableCell>
              <Checkbox label="Requirements" />
              <Info16Regular />
            </TableCell>
            {days.map((day) => (
              <TableCell key={day}>
                <Input className={styles.timeInput} defaultValue="8:75" />
              </TableCell>
            ))}
          </TableRow>
          <TableRow className={styles.taskRow}>
            <TableCell>
              <Checkbox label="Development" />
              <Info16Regular />
            </TableCell>
            {days.map((day) => (
              <TableCell key={day}>
                <Input className={styles.timeInput} defaultValue="8:75" />
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>
              <Button icon={<ChevronDown16Filled />} iconPosition="after">
                Project 2
              </Button>
            </TableCell>
            {days.map((day) => (
              <TableCell key={day} />
            ))}
          </TableRow>
          <TableRow className={styles.taskRow}>
            <TableCell>
              <Checkbox label="Unit Testing" />
              <Info16Regular />
            </TableCell>
            {days.map((day) => (
              <TableCell key={day}>
                <Input className={styles.timeInput} defaultValue="8:75" />
              </TableCell>
            ))}
          </TableRow>
          <TableRow className={styles.taskRow}>
            <TableCell>
              <Checkbox label="Technical Review" />
              <Info16Regular />
            </TableCell>
            {days.map((day) => (
              <TableCell key={day}>
                <Input className={styles.timeInput} defaultValue="8:75" />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Section;

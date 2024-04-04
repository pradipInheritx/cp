import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import PropTypes from "prop-types";
import React from "react";

const headCells = [
  {
    id: "userName",
    numeric: false,
    disablePadding: true,
    label: "User Name"
  },
  {
    id: "userId",
    numeric: false,
    disablePadding: false,
    label: "UserId"
  },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  {
    id: "GameTitle",
    numeric: false,
    disablePadding: false,
    label: "GameTitle"
  },
  {
    id: "TotalCPM",
    numeric: false,
    disablePadding: false,
    label: "TotalCPM"
  },
  {
    id: "totalVotes",
    numeric: false,
    disablePadding: false,
    label: "Total Vote"
  },
  {
    id: "noOfVotesDays",
    numeric: false,
    disablePadding: false,
    label: "NoOf Votes Days"
  },
  {
    id: "lastVoteDay",
    numeric: false,
    disablePadding: false,
    label: "Last Vote Day"
  },
  {
    id: "averageVotes",
    numeric: false,
    disablePadding: false,
    label: "Average Votes"
  },
  {
    id: "source",
    numeric: false,
    disablePadding: false,
    label: "Source"
  },
  {
    id: "extraVotePurchased",
    numeric: false,
    disablePadding: false,
    label: "Extra Vote Purchased"
  },
  {
    id: "TotalAmbassadorRewards",
    numeric: false,
    disablePadding: false,
    label: "TotalAmbassadorRewards"
  },
  {
    id: "signUpTime",
    numeric: false,
    disablePadding: false,
    label: "signUp-Time"
  }
  // { id: 'emailUsage', numeric: true, disablePadding: false, label: 'Email Usage' },
];

function UserTableHead({
  classes,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort
}) {
  const onSortOrderChange = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell> */}
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={onSortOrderChange(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

UserTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

export default React.memo(UserTableHead);

import * as React from "react";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Slide } from "@mui/material";

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

function SimpleSnackbar(props) {
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        props.setOpenSnackbar(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={SlideTransition}
                open={props.openSnackbar}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={props.variant} sx={{ width: '100%' }}>
                    {props.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default SimpleSnackbar;

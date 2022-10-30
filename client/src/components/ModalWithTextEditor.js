import React, {Component} from 'react';
import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import DialogTitle from '@mui/material/DialogTitle';

import EditIcon from "@mui/icons-material/Edit";


const useStyles = (theme) => ({
    margin: {
        margin: theme.spacing.unit,
    },
    saveButton: {
        margin: theme.spacing.unit,
    },
    padding: {
        padding: theme.spacing.unit,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing.unit * 2,
        minWidth: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: theme.spacing.unit * 2,
        paddingTop: theme.spacing.unit * 2,
    },
    blacktext: {
        color: "black"
    },
})


const BootstrapDialogTitle = (props) => {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{m: 0, p: 2}} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};


const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit,
    },
}))(MuiDialogActions);


class ModalWithTextEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            document: this.props.loadedDocument,
            textfieldValue: ""
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({document: nextProps.loadedDocument, textfieldValue: nextProps.loadedDocument.question},)
        //console.log("update")
    }

    componentDidMount() {
        this.setState({textfieldValue: this.state.document.question})
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
        })
    };

    handleClose = () => {
        this.setState({open: false});
    };

    saveEditedText = () => {
        if (window.confirm('Achtung, dies überschreibt das vorherige Highlighting.')) {
            this.setState({open: false}, ()=>{
                this.state.document.question = this.state.textfieldValue
                let currentDoc = this.state.document
                currentDoc.question=this.state.textfieldValue
                this.props.saveTicket(currentDoc)
            })
            // Save it!

        }
    }


    handleTextfieldChange = (event) => {
        this.setState({textfieldValue: event.target.value});
    }



    render() {
        const {classes} = this.props
        return (
            <div>
                <Fab onClick={
                    this.handleClickOpen
                } variant="extended" color="" aria-label="Add"
                     className={classes.predictionButton}>
                    <EditIcon className={classes.extendedIcon}/>
                    Edit Ticket
                </Fab>

                <Dialog
                    onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.open}
                    fullWidth={true}
                    maxWidth="lg"
                >
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                        Edit the ticket
                    </BootstrapDialogTitle>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <TextField
                                className={classes.textField}
                                id="standard-multiline-static"
                                label="Multiline"
                                multiline
                                fullWidth
                                rows={20}
                                onChange={this.handleTextfieldChange}
                                defaultValue={this.state.textfieldValue}
                                variant="filled"
                                margin="normal"
                            />
                        </Grid>
                    </DialogContent>
                    <DialogActions>


                        <Grid container
                              direction="row"
                              sx={{justifyContent: 'space-between'}}
                              alignItems="center"
                        >

                            <Grid item xs={4} className={classes.padding}>
                                <Button onClick={this.handleClose} color="primary">
                                    Close without saving
                                </Button>
                            </Grid>
                            <Grid item xs={4} className={classes.padding}>
                                <Grid container justifyContent="flex-end">
                                    <Button onClick={() => {
                                        this.saveEditedText()
                                    }} color="primary">
                                        Save Edit
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(useStyles)(ModalWithTextEditor);
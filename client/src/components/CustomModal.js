import React, {Component} from 'react';
import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider"
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import * as api from '../api'
import {SettingsContext} from '../App'
import {styled} from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';

import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Chip from "@mui/material/Chip";
import StorageIcon from "@mui/icons-material/Storage";

const fontColor = {
    style: {color: 'rgb(50, 50, 50)'}
}

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
    },
    blacktext: {
        color: "black"
    },
    dataSourceIcon:{
        marginLeft: theme.spacing(2)
    },
    dataSourceDisplay: {
        paddingLeft:theme.spacing(1),
        marginLeft: 'auto',
        margin: theme.spacing(1),
    },
})

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

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


class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            resultContent: this.props.resultContent,
            ticket: this.props.openedTicket,
            editedText: ""
        };
    }

    componentDidMount() {
        this.setState({editedText: this.props.editedText})
        if (this.props.setClick !== undefined) {
            this.props.setClick(this.handleClickOpen)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ticket: nextProps.openedTicket, editedText: this.props.editedText})
        //console.log("update")
    }

    handleClickOpen = (saveticketinstant = false) => {
        if (saveticketinstant == true) {
            let markupText = this.props.getMarkUpTFormat()
            let error = false
            try {
                if (Object.keys(markupText).length === 0) {
                    error = true
                }
            } catch (e) {
            }
            if ((markupText == null || markupText == {} || markupText == undefined || markupText == [] || error) && !this.props.exception)
                alert("Highlighting wird benötigt")
            else {
                this.saveDocument(false, false)
            }

        } else {
            this.setState({
                open: true,
            });
        }


    };

    saveDocument(includedForSolution, learnTicket) {
        this.setState({open: false}, () => {
            this.props.saveCurrentDocument(includedForSolution, learnTicket)
        })
    }

    handleClose = () => {
        this.setState({open: false});
    };

    padTo2Digits = (num) => {

        return num.toString().padStart(2, '0');
    }

    formatDate = (date) => {
        console.log(date)
        return [
            this.padTo2Digits(date.getDate()),
            this.padTo2Digits(date.getMonth() + 1),
            date.getFullYear(),
        ].join('.');

    }


    render() {
        const {classes} = this.props
        return (
            <SettingsContext.Consumer>
                {(settingsContext) => (
                    <>
                        {settingsContext.settings.predictionsEnabled != true ? <Fab onClick={() => {
                            this.handleClickOpen(true)
                        }} variant="extended" color="primary" aria-label="Add"
                                                                                    className={classes.saveButton}>
                            <SaveAltIcon className={classes.extendedIcon}/>
                            Save Ticket
                        </Fab> : <>
                            <div>
                                {this.state.resultContent ?
                                    <Button onClick={this.handleClickOpen} size="small" color="primary">
                                        Show Full Ticket
                                    </Button>
                                    : <Fab onClick={() => {
                                        this.handleClickOpen()
                                    }} variant="extended" color="primary" aria-label="Add"
                                           className={classes.saveButton}>
                                        <SaveAltIcon className={classes.extendedIcon}/>
                                        Review to save
                                    </Fab>}

                                <Dialog
                                    onClose={this.handleClose}
                                    aria-labelledby="customized-dialog-title"
                                    open={this.state.open}
                                    fullWidth={true}
                                    maxWidth="lg"
                                >
                                    <BootstrapDialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                                        <Typography   variant="h6" gutterBottom >
                                        {new Date(this.state.ticket.date).toLocaleDateString()}
                                        </Typography>
                                        {parseInt(new Date(this.state.ticket.date).toLocaleDateString().slice(-4)) <= 2020 ?
                                            <Chip className={classes.dataSourceDisplay}
                                                  icon={<StorageIcon className={classes.dataSourceIcon}/>}
                                                  label={'Erstes Dataset'}
                                                  color="primary"
                                                  size="small"
                                                  variant="outlined" /> :
                                            <Chip className={classes.dataSourceDisplay}
                                                  icon={<StorageIcon className={classes.dataSourceIcon}/>}
                                                  label={'Zweites Dataset'}
                                                  size="small"
                                                  color="primary"/>
                                        }

                                    </BootstrapDialogTitle>
                                    <DialogContent>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} className={classes.padding}>
                                                <Typography variant="h6">Question</Typography>
                                            </Grid>
                                            <Grid item xs={12} className={classes.padding}>
                                                <Typography whiteSpace={"pre-wrap"}
                                                            dangerouslySetInnerHTML={{__html: this.state.editedText}}>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} className={classes.padding}>
                                                <TextField
                                                    disabled
                                                    fullWidth
                                                    inputProps={fontColor}
                                                    id="outlined-disabled"
                                                    label="Report"
                                                    multiline
                                                    placeholder="Placeholder"
                                                    defaultValue={this.state.ticket.report}
                                                    className={classes.textField}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={6} className={classes.padding}>
                                                <TextField
                                                    disabled
                                                    inputProps={fontColor}
                                                    fullWidth
                                                    id="outlined-disabled"
                                                    label="Main Category"
                                                    multiline
                                                    placeholder="Placeholder"
                                                    defaultValue={"No Data"}
                                                    value={this.state.currentDocument.main_category}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={6} className={classes.padding}>
                                                <TextField
                                                    disabled
                                                    inputProps={fontColor}
                                                    fullWidth
                                                    id="outlined-disabled"
                                                    label="Category 1"
                                                    multiline
                                                    placeholder="Placeholder"
                                                    defaultValue={"No Data"}
                                                    value={this.state.currentDocument.category_1}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={6} className={classes.padding}>
                                                <TextField
                                                    disabled
                                                    inputProps={fontColor}
                                                    fullWidth
                                                    id="outlined-disabled"
                                                    label="Category 2"
                                                    multiline
                                                    placeholder="Placeholder"
                                                    defaultValue={"No Data"}
                                                    value={this.state.currentDocument.category_2}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={6} className={classes.padding}>
                                                <TextField
                                                    disabled
                                                    inputProps={fontColor}
                                                    fullWidth
                                                    id="outlined-disabled"
                                                    label="Category 3"
                                                    multiline
                                                    placeholder="Placeholder"
                                                    defaultValue={"No Data"}
                                                    value={this.state.currentDocument.category_3}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} className={classes.padding}>
                                                <Divider/>
                                            </Grid>
                                            <Grid item xs={12} className={classes.padding}>
                                                <Typography variant="h6">History</Typography>
                                            </Grid>
                                            {this.state.ticket.answerhistory !== undefined ? this.state.ticket.answerhistory.map((element) =>
                                                <Grid item xs={12} className={classes.padding}>
                                                    <InputLabel shrink htmlFor="bootstrap-input"
                                                                className={classes.bootstrapFormLabel}>
                                                        {new Date(element.date).toLocaleString()}
                                                    </InputLabel>
                                                    <InputBase
                                                        multiline
                                                        inputProps={fontColor}
                                                        fullWidth
                                                        placeholder="Placeholder"
                                                        disabled
                                                        id="bootstrap-input"
                                                        defaultValue={element.content.trim()}
                                                        classes={{
                                                            root: classes.bootstrapRoot,
                                                            input: classes.bootstrapInput,
                                                        }}
                                                    />
                                                </Grid>
                                            ) : ""}
                                        </Grid>
                                    </DialogContent>
                                    <DialogActions>
                                        {this.state.resultContent ?
                                            <Button onClick={this.handleClose} color="primary">
                                                Close Ticket
                                            </Button> :

                                            <Grid container
                                                  direction="row"
                                                  sx={{justifyContent: 'space-between'}}
                                                  alignItems="center"
                                            >

                                                <Grid item xs={4} className={classes.padding}>
                                                    <Button onClick={this.handleClose} color="primary">
                                                        Close
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={4} className={classes.padding}>
                                                    <Button disabled onClick={() => {
                                                        this.saveDocument(true, true)
                                                    }} color="primary">
                                                        Finish Ticket and ADD to Possible Solutions
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={4} className={classes.padding}>
                                                    <Grid container justifyContent="flex-end">
                                                        <Button onClick={() => {
                                                            this.saveDocument(false, true)
                                                        }} color="primary">
                                                            Finish Ticket
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>


                                        }
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </>}
                    </>)}
            </SettingsContext.Consumer>
        );
    }

}

export default withStyles(useStyles)(CustomModal);
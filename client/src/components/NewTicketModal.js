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

import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from "@mui/icons-material/Add";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker"

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
    openButton: {
        position: "fixed",
        bottom: 10,
        left: 12,
        zIndex: 4,

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
    dataSourceIcon: {
        marginLeft: theme.spacing(2)
    },
    dataSourceDisplay: {
        paddingLeft: theme.spacing(1),
        marginLeft: 'auto',
        margin: theme.spacing(1),
    },
    marginRowTop : {
      marginTop:theme.spacing(1)
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


class NewTicketModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            ticket: {
                markupNFormat: [],
                markupTFormat: {},
                internID: 999999,
                uhd_NR: 9999999,
                date: new Date(),
                report: "",
                main_category:"",
                category_1: "",
                category_2: "",
                category_3: "",
                question: "",
                recommendedTickets: [],
                answerhistory: [{date: new Date(), content: ""}],
                user_evaluation_shown: 9999,
            },
        };
    }


    handleClickOpen = (saveticketinstant = false) => {

        this.setState({
            open: true,
        });


    };
    saveDocument = () =>{
        api.saveNewTicket(this.state.ticket, ()=>{
            window.location = "/"
        }, (e)=>{
            alert("Error saving the Ticket")
            console.log(e)
        })
        console.log(this.state.ticket)
    }

    handleClose = () => {
        this.setState({open: false});
    };


    addAnswerHistoryField = () => {
        let new_ticket = this.state.ticket
        new_ticket.answerhistory.push({date: new Date(), content: ""})
        this.setState({ticket: new_ticket})
    }
    removeAnswerHistoryField = (position) => {
        if (position < 0 || position >= this.state.ticket.answerhistory.length) {
            alert("Error, diese Answerhistory existiert nicht")
        } else {
            let new_ticket = this.state.ticket
            new_ticket.answerhistory.splice(position, 1)
            this.setState({ticket: new_ticket})
        }
    }

    padTo2Digits = (num) => {

        return num.toString().padStart(2, '0');
    }
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

                        {settingsContext.settings.predictionsEnabled != true ? <></> : <>
                            <div>
                                <Fab
                                    color="primary"
                                    aria-label="add"
                                    onClick={() => {
                                        this.handleClickOpen(true)
                                    }}
                                    className={classes.openButton}


                                >
                                    <AddIcon/>
                                </Fab>

                                <Dialog
                                    onClose={this.handleClose}
                                    aria-labelledby="customized-dialog-title"
                                    open={this.state.open}
                                    fullWidth={true}
                                    maxWidth="lg"
                                >
                                    <BootstrapDialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                                        <Typography variant="h6" gutterBottom>
                                            Neues Ticket erstellen
                                        </Typography>


                                    </BootstrapDialogTitle>
                                    <DialogContent>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} className={classes.padding} style={{paddingTop: 15}}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateTimePicker label={"Ticketerstellungszeitpunkt"}
                                                                    value={this.state.ticket.date}
                                                                    inputFormat={"DD.MM.YYYY HH:mm"}
                                                                    ampm={false}
                                                                    onChange={(newValue) => {
                                                                        let new_ticket = this.state.ticket
                                                                        new_ticket.date = newValue.toDate()
                                                                        this.setState({ticket: new_ticket})
                                                                    }}
                                                                    renderInput={(params) => <TextField{...params}
                                                                    />}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={12} className={classes.padding}>
                                                <TextField
                                                    fullWidth
                                                    inputProps={fontColor}
                                                    id="outlined-disabled"
                                                    label="Question"
                                                    multiline
                                                    placeholder=""
                                                    className={classes.textField}
                                                    margin="normal"
                                                    variant="outlined"
                                                    onChange={(event)=>{
                                                        let new_ticket =this.state.ticket
                                                        new_ticket.question=event.target.value
                                                        this.setState({ticket:new_ticket})
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} className={classes.padding}>
                                                <TextField
                                                    fullWidth
                                                    inputProps={fontColor}
                                                    id="outlined-disabled"
                                                    label="Report"
                                                    placeholder=""
                                                    className={classes.textField}
                                                    margin="normal"
                                                    variant="outlined"
                                                    onChange={(event)=>{
                                                        let new_ticket =this.state.ticket
                                                        new_ticket.report=event.target.value
                                                        this.setState({ticket:new_ticket})
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} className={classes.padding}>
                                                <TextField
                                                    inputProps={fontColor}
                                                    fullWidth
                                                    id="outlined-disabled"
                                                    label="Main Category"
                                                    placeholder=""
                                                    className={classes.textField}
                                                    margin="normal"
                                                    variant="outlined"
                                                    onChange={(event)=>{
                                                        let new_ticket =this.state.ticket
                                                        new_ticket.main_category=event.target.value
                                                        this.setState({ticket:new_ticket})
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} className={classes.padding}>
                                                <TextField
                                                    inputProps={fontColor}
                                                    fullWidth
                                                    id="outlined-disabled"
                                                    label="Category 1"
                                                    placeholder=""
                                                    className={classes.textField}
                                                    margin="normal"
                                                    variant="outlined"
                                                    onChange={(event)=>{
                                                        let new_ticket =this.state.ticket
                                                        new_ticket.category_1=event.target.value
                                                        this.setState({ticket:new_ticket})
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} className={classes.padding}>
                                                <TextField
                                                    inputProps={fontColor}
                                                    fullWidth
                                                    id="outlined-disabled"
                                                    label="Category 2"
                                                    placeholder=""
                                                    className={classes.textField}
                                                    margin="normal"
                                                    variant="outlined"
                                                    onChange={(event)=>{
                                                        let new_ticket =this.state.ticket
                                                        new_ticket.category_2=event.target.value
                                                        this.setState({ticket:new_ticket})
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} className={classes.padding}>
                                                <TextField
                                                    inputProps={fontColor}
                                                    fullWidth
                                                    id="outlined-disabled"
                                                    label="Category 3"
                                                    placeholder=""
                                                    className={classes.textField}
                                                    margin="normal"
                                                    variant="outlined"
                                                    onChange={(event)=>{
                                                        let new_ticket =this.state.ticket
                                                        new_ticket.category_3=event.target.value
                                                        this.setState({ticket:new_ticket})
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} className={classes.padding}>
                                                <Divider/>
                                            </Grid>
                                            <Grid item xs={12} className={classes.padding}>
                                                <Typography variant="h6">History</Typography>
                                            </Grid>

                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                {this.state.ticket.answerhistory !== [] ? this.state.ticket.answerhistory.map((element, index) =>
                                                    <Grid item xs={12} className={classes.padding}>
                                                        <Grid container spacing={1} direction="row"
                                                              alignItems="center"
                                                              justifyContent="center">
                                                            <Grid item xs={2} className={`${classes.padding} ${classes.marginRowTop}`}>
                                                                <DateTimePicker
                                                                    label={"Datum und Uhrzeit auswählen"}
                                                                    value={element.date}
                                                                    inputFormat={"DD.MM.YYYY HH:mm"}
                                                                    ampm={false}
                                                                    style={{marginTop: "auto"}}
                                                                    onChange={(newValue) => {
                                                                        let new_ticket = this.state.ticket
                                                                        new_ticket.answerhistory[index].date = newValue.toDate()
                                                                        this.setState({ticket: new_ticket})
                                                                    }}
                                                                    renderInput={(params) =>
                                                                        <TextField{...params}

                                                                        />}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={9} className={`${classes.padding} ${classes.marginRowTop}`}>

                                                                <TextField
                                                                    inputProps={fontColor}
                                                                    fullWidth
                                                                    multiline
                                                                    id="outlined-disabled"
                                                                    label="Content"
                                                                    placeholder=""
                                                                    className={classes.textField}
                                                                    variant="outlined"
                                                                    value={element.content}
                                                                    onChange={(event) => {
                                                                        let new_ticket = this.state.ticket
                                                                        new_ticket.answerhistory[index].content = event.target.value
                                                                        this.setState({ticket: new_ticket})
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={1} className={`${classes.padding} ${classes.marginRowTop}`}>


                                                                <Fab
                                                                    color="primary"
                                                                    aria-label="remove"
                                                                    onClick={() => {
                                                                        this.removeAnswerHistoryField(index)
                                                                    }}


                                                                >
                                                                    <CloseIcon/>
                                                                </Fab>

                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                ) : <></>}
                                            </LocalizationProvider>
                                            <Button onClick={this.addAnswerHistoryField} color="primary">
                                                Add Answerhistory Element
                                            </Button>

                                        </Grid>
                                    </DialogContent>
                                    <DialogActions>
                                        {false ?
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

                                                </Grid>
                                                <Grid item xs={4} className={classes.padding}>
                                                    <Grid container justifyContent="flex-end">
                                                        <Button onClick={() => {
                                                            this.saveDocument()
                                                        }} color="primary">
                                                            Save Ticket
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

export default withStyles(useStyles)(NewTicketModal);
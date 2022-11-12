import React, {Component} from 'react';
import clsx from 'clsx';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText'
import withStyles from '@mui/styles/withStyles';
import Box from '@mui/material/Box';
import {CardMedia} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import * as api from '../api'
import * as session from '../session'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {SettingsContext} from '../App'
import StorageIcon from '@mui/icons-material/Storage';
import Button from '@mui/material/Button';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalWithTextEditor from "../components/ModalWithTextEditor";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import CustomModal from "../components/CustomModal";
import CardComponent from "../components/CardComponent";
import ListItemIcon from "@mui/material/ListItemIcon";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {red} from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import InputBase from "@mui/material/InputBase";
import NewTicketModal from "../components/NewTicketModal";
import Chip from '@mui/material/Chip';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import BedtimeIcon from '@mui/icons-material/Bedtime';


const drawerWidth = 240;

const useStyles = (theme) => ({
    root: {
        display: 'flex',
        userSelect: 'none',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    logoutButton: {
        marginLeft: 'auto',
        margin: theme.spacing(1),
        //backgroundColor: "#ffffff",
        color: theme.palette.primary,
        border: "1px solid",
        borderColor: theme.palette.primary,

    },
    dataSourceDisplay: {
        paddingLeft:theme.spacing(1),
        marginLeft: 'auto',
        margin: theme.spacing(1),
    },
    adminButton: {
        margin: theme.spacing(1),
        //backgroundColor: "#ffffff",
        color: theme.palette.primary,
        border: "1px solid",
        borderColor: theme.palette.primary,

    },
    hide: {
        display: 'none',
    },
    AppBoxTitle: {
        display: "flex"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    media: {
        maxHeight: 50,
        maxWidth: 140,
        marginLeft: theme.spacing(2),
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        height: '100vh',
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },

    highlighteditor: {
        display: 'flex',
    },
    list: {
        padding: theme.spacing(2),
        height: '100vh',
        overflow: 'auto',
        minWidth: drawerWidth,
        width: drawerWidth,
        borderLeft: '1px lightgrey solid'
    },


    highlightGreen: {
        backgroundColor: 'green'
    },
    cardArea: {
        paddingBottom: theme.spacing(2),
        marginTop: 'auto',
        width: '100%',
    },
    cardDivider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        width: '100%'
    },
    contentArea: {
        flexGrow: 1,
        padding: theme.spacing(2),
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },

    allCards: {
        padding: theme.spacing(2),
    },
    margin: {
        margin: theme.spacing.unit,
    },
    deleteButton: {
        margin: theme.spacing.unit,
        backgroundColor: red[500],
        color: "#FFFFFF"
    },
    predictionButton: {
        margin: theme.spacing.unit,
        backgroundColor: "#ffffff",
        color: theme.palette.primary,
        border: "1px solid",
        borderColor: theme.palette.primary,

    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    dataSourceIcon:{
        marginLeft: theme.spacing(2)
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
        userSelect: 'text'
    },
    blacktext: {
        color: "black"
    },
    formTextDisplay:{
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    }
});

const fontColor = {
    style: {color: 'rgb(50, 50, 50)'}
}

class NewTicketSystem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen: true,
            allTickets: [],
            currentDocument: {date: new Date(), question: "question", report: "report", recommendedTickets: []},
            isLoading: true,
            editedText: ""
        }
    }

    componentDidMount() {
        this.updateTicketList(() => {
            this.fixHistoricData(() => {
                this.setMarkUpNFormat(() => {
                    this.getHighlightedText()
                    console.log(this.state.currentDocument)
                    this.setState({isLoading: false})
                })
            })
        })
    }

    fixHistoricData(cb) {
        let currentDocument = this.state.currentDocument
        if (currentDocument.isFixed == undefined) {
            for (let rec of currentDocument.recommendedTickets) {
                rec.learned = true
                console.log(rec)
                for (let predAct of rec.predictedItems) {
                    console.log(predAct)
                    predAct.ticket = JSON.parse(JSON.stringify(predAct.id))
                    predAct.id = predAct.ticket._id
                    predAct.ratingLocal = predAct.cost * -5
                }
            }
            currentDocument.isFixed = true
        }

        this.setState({currentDocument: currentDocument}, () => {
            cb()
        })
    }

    setMarkUpNFormat(cb) {
        /**api.getMarkUpFormat(this.state.currentDocument.question, (data) => { HERE
                var currentDocument = {...this.state.currentDocument}
                currentDocument.markupNFormat = data.nFormat
                this.setState(
                    {currentDocument}
                )

                cb()
            }
            , (error) => {
                console.log(error)
                alert("Error getting Highlighting")
                cb()
            }
        )*/
        //alert("Highlighting deactivated")
        cb()
    }

    updateTicketList = (cb) => {
        api.getTickets((result) => {
            if (result[0] == undefined) {
                this.setState({
                    currentDocument: {question: "NoTicketFound", report: "NoTicketFound", recommendedTickets: []},
                    allTickets: result,
                    isLoading: false
                })
            } else {
                this.setState({currentDocument: result[0], allTickets: result})
                this.updateCurrentDocument(0)
                cb()
            }
        }, (error) => {
            alert("Error Getting Tickets")
            console.log(error)
            cb()
        })
    }

    handleDrawerOpen = () => {
        this.setState({drawerOpen: true});
    };

    handleDrawerClose = () => {
        this.setState({drawerOpen: false});
    };

    updateCurrentDocument = (index) => {
        console.log(this.state.currentDocument)
        this.setState({isLoading: true, currentDocument: this.state.allTickets[index]}, () => {
            console.log(this.state.currentDocument)
            this.fixHistoricData(() => {
                this.setMarkUpNFormat(() => {
                    this.getHighlightedText() //HERE
                    //this.getNewPrediction() HERE
                    this.setState({isLoading: false})

                })
            })
        })
    }

    getHighlightedText = () => {
        console.log("gettingText")
        let textedit = this.state.currentDocument.question
        //console.log(this.state.ticket)
        let text = ""
        if (this.state.currentDocument.markupNFormat === undefined) {
            text = textedit
            this.setState({editedText: text}, () => {
                return text
            })
        } else {
            //console.log(this.state.ticket)
            let markup = this.state.currentDocument.markupNFormat.sort((a, b) => parseFloat(b.end) - parseFloat(a.end));
            text = textedit
            /**for (let a of markup) {

                text = [text.slice(0, a.end), "</span>", text.slice(a.end)].join('');
                text = [text.slice(0, a.start), "<span style='background-color: " + a.color + "; border-radius:" +
                (Math.floor(Math.random() * (18 - 10)) + 10) + "px " +
                (Math.floor(Math.random() * (18 - 10)) + 10) + "px " +
                (Math.floor(Math.random() * (18 - 10)) + 10) + "px " +
                (Math.floor(Math.random() * (18 - 10)) + 10) + "px " +
                ";  padding: " +
                (Math.floor(Math.random() * (10 - 2)) + 2) + "px " +
                (Math.floor(Math.random() * (10 - 2)) + 2) + "px " +
                (Math.floor(Math.random() * (10 - 2)) + 2) + "px " +
                (Math.floor(Math.random() * (10 - 2)) + 2) + "px'>", text.slice(a.start)].join('');
            }**/
            for (let a of markup) {

                text = [text.slice(0, a.end), "</span>", text.slice(a.end)].join('');
                text = [text.slice(0, a.start), "<span style='background-color: " + a.color + "; border-radius: 20px; padding-left: 4px;padding-right: 4px; padding-bottom: 2px; padding-top: 2px'>", text.slice(a.start)].join('');
            }
            this.setState({editedText: text}, () => {
                console.log(this.getMarkUpTFormat())
                return text
            })
        }
    }

    getEditedDocument = (doc) => {
        this.setState({currentDocument: doc, isLoading: true}, () => {
            this.setMarkUpNFormat(() => {
                this.getHighlightedText()
                console.log(this.state.currentDocument)
                this.setState({isLoading: false})
            })
        })
    }

    getMarkUpTFormat = () => {
        let markupText = {}
        for (let i = this.state.currentDocument.markupNFormat.length - 1; i >= 0; i--) {
            let obj = this.state.currentDocument.markupNFormat[i]
            markupText[[obj.key]] = []
        }
        for (let i = this.state.currentDocument.markupNFormat.length - 1; i >= 0; i--) {
            let obj = this.state.currentDocument.markupNFormat[i]
            let t = this.state.currentDocument.question.slice(obj.start, obj.end)
            markupText[obj.key].push(t)
        }

        return markupText
    }

    getNewPrediction = () => {
        // predict new feedback
        let markupText = this.getMarkUpTFormat()
        let error = false
        try {
            if (Object.keys(markupText).length === 0) {
                error = true
            }
        } catch (e) {
        }
        if (false && (markupText == null || markupText == undefined || markupText == [] || Object.keys(markupText).length === 0 || error)) {
            alert("Highlighting wird benötigt")
            this.setState({isLoading: false})
        } else {
            api.getPrediction(markupText, (data) => {
                let currentDocument = this.state.currentDocument
                let c = 0
                for (let predictItem of data.prediction) {
                    predictItem.ratingLocal = 0
                    predictItem.cost = 0
                    predictItem.id = data.prediction[c].ticket._id
                    c++
                }
                currentDocument.recommendedTickets.push({
                    usedNFormat: JSON.parse(JSON.stringify(this.state.currentDocument.markupNFormat)),
                    usedTFormat: markupText,
                    finalPrediction: false,
                    learned: false,
                    itemsIncluded: data.itemsIncluded,
                    predictedItems: data.prediction
                })
                console.log(currentDocument)
                this.setState({currentDocument: currentDocument, isLoading: false})
            }, (e) => {
                alert("Error Getting Prediction")
                console.log(e)
                this.setState({isLoading: false})
            })
        }
    }

    saveCurrentDocument = (includedForSolutions, learnTicket) => {
        this.setState({isLoading: true}, () => {
            let currentDocument = this.state.currentDocument
            currentDocument.includedForSolutions = includedForSolutions
            currentDocument.hasBeenReviewed = true
            currentDocument.reviewedDate = Date.now()
            currentDocument.markupTFormat = this.getMarkUpTFormat()
            currentDocument.includedForSolutions = includedForSolutions
            if (currentDocument.recommendedTickets.length > 0 && learnTicket == true && currentDocument.recommendedTickets.slice(-1)[0].learned == false) {
                //  learn current Ticket
                currentDocument.recommendedTickets.slice(-1)[0].finalPrediction = true
                this.setState({currentDocument: currentDocument}, () => {
                    api.learnAndSavePrediction(this.state.currentDocument, () => {
                        this.updateTicketList(() => {
                            this.setMarkUpNFormat(() => {
                                this.getHighlightedText()
                                console.log(this.state.currentDocument)
                                this.setState({isLoading: false})
                            })
                        })
                    }, (err) => {
                        console.log(err)
                        alert("Error Saving and learning Ticket")
                        this.setState({isLoading: false})
                        alert("Error Saving Ticket")
                    })
                })
            } else {
                // save current Ticket
                this.setState({currentDocument: currentDocument}, () => {
                    let currentDocument = this.state.currentDocument
                    if (currentDocument.recommendedTickets.length > 0) {
                        currentDocument.recommendedTickets.slice(-1)[0].finalPrediction = true
                    }
                    currentDocument.includedForSolutions = includedForSolutions
                    currentDocument.hasBeenReviewed = true
                    currentDocument.reviewedDate = Date.now()
                    currentDocument.markupTFormat = this.getMarkUpTFormat()

                    this.setState({currentDocument: currentDocument}, () => {
                        api.saveTicket(this.state.currentDocument, () => {
                            this.updateTicketList(() => {
                                this.setMarkUpNFormat(() => {
                                    this.getHighlightedText()
                                    console.log(this.state.currentDocument)
                                    this.setState({isLoading: false})
                                })
                            })
                        }, (err) => {
                            alert("Error saving ticket")
                            console.log(err)
                            this.setState({isLoading: false})
                        })
                    })
                })
            }
        })
    }

    getPrediction = () => {
        this.setState({isLoading: true}, () => {
            let AllUsedHighlightings = []
            for (let Tf of this.state.currentDocument.recommendedTickets) {
                AllUsedHighlightings.push(JSON.stringify(Tf.usedTFormat))
            }
            let currentTFormat = JSON.stringify(this.getMarkUpTFormat())
            if (false && this.state.currentDocument.recommendedTickets.length > 0 && AllUsedHighlightings.includes(currentTFormat)) {
                let currentDoc = this.state.currentDocument
                currentDoc.markupTFormat = this.getMarkUpTFormat()
                if (currentDoc.recommendedTickets.slice(-1)[0].learned == false) {
                    currentDoc.recommendedTickets.slice(-1)[0].learned = true
                    this.setState({currentDocument: currentDoc})
                    api.learnAndSavePrediction(this.state.currentDocument, () => {
                        //alert("This Markup has been learned. Please change the markup before trying to get a new prediction")
                        this.setState({isLoading: false})
                    }, (err) => {
                        console.log(err)
                        this.setState({isLoading: false})
                        alert("ErrorLearningAndSavingPrediction")
                    })
                } else {
                    alert("Please do not use a historical used Highlighting your Highlighting")
                    this.setState({isLoading: false})
                }
            } else {
                if (this.state.currentDocument.recommendedTickets.length > 0) {
                    // save and learn current feedback
                    let currentDoc = this.state.currentDocument
                    currentDoc.markupTFormat = this.getMarkUpTFormat()
                    currentDoc.recommendedTickets.slice(-1)[0].learned = true
                    this.setState({currentDocument: currentDoc})
                    api.learnAndSavePrediction(this.state.currentDocument, () => {
                        this.getNewPrediction()
                    }, (err) => {
                        console.log(err)
                        this.setState({isLoading: false})
                        alert("ErrorLearningAndSavingPrediction")
                    })
                } else {
                    this.getNewPrediction()
                }
            }
        })
    }

    updateRating(index, value) {
        this.setState({isLoading: true}, () => {
            let currentDoc = this.state.currentDocument
            currentDoc.recommendedTickets.slice(-1)[0].predictedItems[index].ratingLocal = value
            currentDoc.recommendedTickets.slice(-1)[0].predictedItems[index].cost = value / -5
            this.setState({isLoading: false, currentDocument: currentDoc})
        })
    }

    markUpSort = () => {
        let currentDocument = this.state.currentDocument
        currentDocument.markupNFormat.sort((a, b) => parseFloat(b.end) - parseFloat(a.end));
        let i = currentDocument.markupNFormat.length - 1
        while (i > 0) {
            if (currentDocument.markupNFormat[i].end == currentDocument.markupNFormat[i - 1].start && currentDocument.markupNFormat[i].key == currentDocument.markupNFormat[i - 1].key) {
                currentDocument.markupNFormat[i - 1].start = currentDocument.markupNFormat[i].start
                currentDocument.markupNFormat.splice(i, 1)
            }

            i--
        }
        this.setState({currentDocument: currentDocument})
    }

    markText = (color, key) => {
        let container = document.getElementById("textField")
        let sel = window.getSelection();
        if (sel.rangeCount !== 0) {

            let range = sel.getRangeAt(0);
            let sel_start = range.startOffset;
            let sel_end = range.endOffset;

            let charsBeforeStart = this.getCharactersCountUntilNode(range.startContainer, container);
            let charsBeforeEnd = this.getCharactersCountUntilNode(range.endContainer, container);
            if (charsBeforeStart < 0 || charsBeforeEnd < 0) {
                console.warn('out of range');
                return;
            }
            let start_index = charsBeforeStart + sel_start;
            let end_index = charsBeforeEnd + sel_end;
            //if (color!=="clear")
            this.markUpAdd(start_index, end_index, color, key)
            //}
            this.markUpSort()
            this.getHighlightedText()
        }
    }

    getCharactersCountUntilNode = (node, parent) => {
        var walker = document.createTreeWalker(
            parent || document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        var found = false;
        var chars = 0;
        while (walker.nextNode()) {
            if (walker.currentNode === node) {
                found = true;
                break;
            }
            chars += walker.currentNode.textContent.length;
        }
        if (found) {
            return chars;
        } else return -1;
    }

    clearAllMarkUp = () => {
        if (window.confirm('Are you sure you want to clear all Highlighting?')) {
            // Save it!
            let currentDocument = this.state.currentDocument
            currentDocument.markupNFormat = []
            this.setState({editedText: this.state.currentDocument.question, currentDocument: currentDocument})
        }
    }

    markUpAdd = (start, end, color, key) => {
        let allMarkUp = this.state.currentDocument.markupNFormat
        for (let a of allMarkUp) {
            if (a.start < start && a.end > end) {
                allMarkUp.push({start: end, end: a.end, color: a.color, key: a.key})
                a.end = start
            } else {
                if (a.start >= start && a.start < end) {
                    a.start = end
                }
                if (a.end >= start && a.end <= end) {
                    a.end = start
                }
            }
        }
        let i = 0
        while (i < allMarkUp.length) {
            if (allMarkUp[i].start > allMarkUp[i].end || allMarkUp[i].color === "clear") {
                allMarkUp.splice(i, 1);
                i--
            }
            i++
        }
        let currentDocument = this.state.currentDocument
        if (color != "clear") {
            allMarkUp.push({start: start, end: end, color: color, key: key})
        }
        currentDocument.markupNFormat = allMarkUp
        this.setState({markup: allMarkUp, currentDocument: currentDocument})
    }

    deleteCurrentDocument = () => {
        if (window.confirm('Are you sure you want to delete this ticket')) {
            // Save it!
            this.setState({isLoading: true}, () => {
                api.deleteTicket(this.state.currentDocument._id, (data) => {
                    this.updateTicketList(() => {
                        this.setMarkUpNFormat(() => {
                            this.getHighlightedText()

                            console.log(this.state.currentDocument)
                            this.setState({isLoading: false})

                        })

                    })
                }, (e) => {
                    console.log(e)
                    alert("error Removing Document")
                })
            })

        }
    }
    padTo2Digits = (num) => {

        return num.toString().padStart(2, '0');
    }

    formatDate = (date) => {
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
                    <div className={classes.root}>

                        <Backdrop
                            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                            open={this.state.isLoading}
                        >
                            <CircularProgress color="inherit"/>
                        </Backdrop>
                        <CssBaseline/>
                        <AppBar
                            position="fixed"
                            className={clsx(classes.appBar, {
                                [classes.appBarShift]: this.state.drawerOpen,
                            })}
                        >
                            <Toolbar>

                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={this.handleDrawerOpen}
                                    edge="start"
                                    className={clsx(classes.menuButton, this.state.drawerOpen && classes.hide)}
                                    size="large">
                                    <MenuIcon/>
                                </IconButton>
                                <Typography variant="h6" noWrap className={classes.AppBoxTitle}>
                                    Editor &nbsp;
                                    <Box color="text.disabled" overflow={"hidden"}>
                                        {"/ " + this.state.currentDocument.report}
                                    </Box>
                                </Typography>
                                <Button onClick={() => {
                                    api.logout(() => {
                                        window.location = '/'
                                    }, (e) => {
                                        window.location = '/'
                                    })
                                }} variant="extended" color="" className={classes.logoutButton}
                                        startIcon={<LogoutIcon/>}>
                                    Logout
                                </Button>
                                {session.hasRole('admin') ?
                                    <Button href="/adminstrator" variant="extended" color=""
                                            className={classes.adminButton}
                                            startIcon={<AdminPanelSettingsIcon/>}>
                                        Admin
                                    </Button> : <></>}
                                {settingsContext.settings.logoEnabled ? <CardMedia
                                    className={classes.media}
                                    image={settingsContext.settings.logoFile}
                                    title="image"
                                    component="img"
                                /> : <div></div>}
                            </Toolbar>
                        </AppBar>
                        <Drawer

                            className={classes.drawer}
                            variant="persistent"
                            anchor="left"
                            open={this.state.drawerOpen}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >

                            <NewTicketModal/>
                            <div className={classes.drawerHeader}>
                                <IconButton onClick={this.handleDrawerClose} size="large">
                                    {useStyles.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                                </IconButton>
                            </div>
                            <Divider/>
                            <List>
                                {this.state.allTickets.map((item, index) => (
                                    <ListItem button key={index} onClick={(e) => {
                                        this.updateCurrentDocument(index)
                                    }}>
                                        <ListItemText primary={this.formatDate(new Date(item.date))}
                                                      secondary={<div style={{
                                                          height: 17,
                                                          overflow: 'hidden',
                                                          textOverflow: 'hidden'
                                                      }}>{item.question}</div>}/>
                                    </ListItem>
                                ))}
                            </List>
                        </Drawer>
                        <main
                            className={clsx(classes.content, {
                                [classes.contentShift]: this.state.drawerOpen,
                            })}
                        >
                            <div className={classes.highlighteditor}>
                                <div className={classes.contentArea}>
                                    <div className={classes.drawerHeader}/>

                                    <Grid container spacing={1}>

                                        <Typography   variant="h6" gutterBottom >
                                            {new Date(this.state.currentDocument.date).toLocaleDateString()}
                                        </Typography>
                                        {parseInt(new Date(this.state.currentDocument.date).toLocaleDateString().slice(-4)) <= 2020 ?
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

                                        <Grid item xs={12} className={classes.padding}>
                                            <Typography variant="h6">Question</Typography>
                                        </Grid>

                                        <Grid item xs={12} className={classes.padding}>
                                            <Typography id="textField" className={classes.textField} whiteSpace={"pre-wrap"}
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
                                                defaultValue={"Report"}
                                                value={this.state.currentDocument.report}
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
                                        {this.state.currentDocument.answerhistory !== undefined ? this.state.currentDocument.answerhistory.map((element) =>
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
                                    <div className={classes.cardArea}>
                                        <Grid container direction="row" justifyContent="space-evenly">
                                            <Grid item xs={settingsContext.settings.predictionsEnabled ? 3 : 4}
                                                  className={classes.allCards}>
                                                <Fab disabled onClick={() => {
                                                    this.deleteCurrentDocument()
                                                }} variant="extended" color="" aria-label="Add"
                                                     className={classes.deleteButton}>
                                                    <DeleteIcon className={classes.extendedIcon}/>
                                                    Remove Ticket from Dataset
                                                </Fab>
                                            </Grid>
                                            <Grid display="flex"
                                                  justifyContent="center" item
                                                  xs={settingsContext.settings.predictionsEnabled ? 3 : 4}
                                                  className={classes.allCards}>
                                                <ModalWithTextEditor loadedDocument={this.state.currentDocument}
                                                                     saveTicket={(doc) => {
                                                                         this.getEditedDocument(doc)
                                                                     }}/>
                                            </Grid>
                                            {settingsContext.settings.predictionsEnabled ?
                                                <Grid display="flex"
                                                      justifyContent="center" item xs={3}
                                                      className={classes.allCards}>
                                                    <Fab onClick={() => {
                                                        this.getPrediction()
                                                    }} variant="extended" color="" aria-label="Add"
                                                         className={classes.predictionButton}>
                                                        <ManageSearchIcon className={classes.extendedIcon}/>
                                                        Get Prediction
                                                    </Fab>
                                                </Grid> : <></>}
                                            <Grid align="left"
                                                  style={{display: "flex", justifyContent: "flex-end"}}
                                                  item xs={settingsContext.settings.predictionsEnabled ? 3 : 4}
                                                  className={classes.allCards}>
                                                <CustomModal
                                                    editedText={this.state.editedText}
                                                    documentSaved={() => {
                                                        this.props.documentSaved()
                                                    }}
                                                    getMarkUpTFormat={this.getMarkUpTFormat}
                                                    resultContent={false}
                                                    openedTicket={this.state.currentDocument}
                                                    getHighlightedText={() => {
                                                        this.getHighlightedText()
                                                    }}
                                                    saveCurrentDocument={(includedForSolutions, learnTicket) => {
                                                        this.saveCurrentDocument(includedForSolutions, learnTicket)
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Divider className={classes.cardDivider}/>
                                        <Grid container direction="row" justifyContent="space-evenly">
                                            {this.state.currentDocument.recommendedTickets.length > 0 && this.state.currentDocument.recommendedTickets.slice(-1)[0].predictedItems[0].ticket != undefined ?
                                                this.state.currentDocument.recommendedTickets.slice(-1)[0].predictedItems.map((item, index) => {
                                                    return (
                                                        <Grid item xs={3} className={classes.allCards}>
                                                            <CardComponent probability={item.probability}
                                                                           ticket={item.ticket}
                                                                           getMarkUpTFormat={() => {
                                                                               this.getMarkUpTFormat()
                                                                           }}
                                                                           rating={item.ratingLocal}
                                                                           updateRating={(value) => {
                                                                               this.updateRating(index, value)
                                                                           }}/>
                                                        </Grid>
                                                    )
                                                })
                                                : <div></div>}
                                        </Grid>

                                    </div>
                                </div>
                                <div className={classes.list}>
                                    <div className={classes.drawerHeader}/>
                                    <List style={{position:'fixed'}}>
                                        {settingsContext.settings.categories ? settingsContext.settings.categories.map((item, index) => (
                                            <ListItem key={item.key} button onClick={() => {
                                                this.markText(item.color, item.key)
                                            }}>
                                                <ListItemIcon>
                                                    <FiberManualRecordIcon style={{color: item.color}}/>
                                                </ListItemIcon>
                                                <ListItemText primary={item.categoryName}/>
                                            </ListItem>
                                        )) : <></>}
                                        <ListItem key={'clear'} button onClick={() => {
                                            this.markText('clear')
                                        }}>
                                            <ListItemIcon>
                                                <FiberManualRecordIcon style={{color: "grey"}}/>
                                            </ListItemIcon>
                                            <ListItemText primary="Clear"/>
                                        </ListItem>
                                        <Divider key={'divider'}/>
                                        <ListItem key={'allClear'} button onClick={() => {
                                            this.clearAllMarkUp()
                                        }}>
                                            <ListItemIcon>
                                                <HighlightOffIcon style={{color: "black"}}/>
                                            </ListItemIcon>
                                            <ListItemText primary="Clear All"/>
                                        </ListItem>
                                    </List>
                                </div>
                            </div>
                        </main>
                    </div>
                )}
            </SettingsContext.Consumer>
        );
    }
}

export default withStyles(useStyles)(NewTicketSystem);
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
import HighlightEditor from '../components/HighlightEditor'
import withStyles from '@mui/styles/withStyles';
import Box from '@mui/material/Box';
import {CardMedia} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import * as api from '../api'
import * as session from '../session'

import {SettingsContext} from '../App'

import Button from '@mui/material/Button';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

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
});

class TicketSystem extends Component {
    constructor(props) {
        super(props);
        console.log(window.sessionStorage.getItem('userRole'))
        this.state = {
            open: true,
            allTickets: [],
            currentDocument: {question: "question", report: "report"}
        }
    }

    componentDidMount() {
        this.updateTicketList()
    }

    updateTicketList = () => {
        api.getTickets((result)=>{

            if (result[0] == undefined) {
                this.setState({currentDocument: {question: "NoTicketFound", report:"NoTicketFound"}, allTickets: result})

            } else {
                this.setState({currentDocument: result[0], allTickets: result})
            }
        }, (error)=>{
            console.log(error)
        })
    }

    handleDrawerOpen = () => {
        this.setState({open: true});
    };
    handleDrawerClose = () => {
        this.setState({open: false});
    };
    updateCurrentDocument = (index) => {
        this.setState({currentDocument: this.state.allTickets[index]})
    }


    render() {
        const {classes} = this.props


        return (

            <SettingsContext.Consumer>
                {(settingsContext) => (
                    <div className={classes.root}>

                        <CssBaseline/>
                        <AppBar
                            position="fixed"
                            className={clsx(classes.appBar, {
                                [classes.appBarShift]: this.state.open,
                            })}
                        >
                            <Toolbar>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={this.handleDrawerOpen}
                                    edge="start"
                                    className={clsx(classes.menuButton, this.state.open && classes.hide)}
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
                                            className={classes.adminButton} startIcon={<AdminPanelSettingsIcon/>}>
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
                            open={this.state.open}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
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
                                        <ListItemText primary={item.date} secondary={<div style={{
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
                                [classes.contentShift]: this.state.open,
                            })}
                        >

                            <HighlightEditor documentSaved={() => {
                                this.updateTicketList()
                            }} loadedDocument={this.state.currentDocument} categories={settingsContext} ticketDone={()=>this.updateTicketList()}/>
                        </main>
                    </div>
                )}
            </SettingsContext.Consumer>
        );
    }
}

export default withStyles(useStyles)(TicketSystem);

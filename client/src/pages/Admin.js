import React, {Component} from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as  api from '../api'
import withStyles from '@mui/styles/withStyles';
import Toolbar from "@mui/material/Toolbar";
import LogoutIcon from "@mui/icons-material/Logout";
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import {CardMedia} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import List from '@mui/material/List'
import {SettingsContext} from '../App'
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import FolderIcon from '@mui/icons-material/Folder';
import {
    LineChart,
    Tooltip,
    CartesianGrid,
    Line,
    XAxis,
    YAxis,
    Label,
    ResponsiveContainer
} from 'recharts';
import Divider from "@mui/material/Divider";
import RegisterNewUser from "../components/RegisterNewUser";
import DefineSettingsComponent from "../components/DefineSettingsComponent";


const useStyles = (theme) => ({
    root: {
        display: 'flex',
        userSelect: 'none',
    },
    AppBoxTitle: {
        display: "flex"
    },
    media: {
        maxHeight: 50,
        maxWidth: 140,
        marginLeft: theme.spacing(2),
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
    content: {
        padding: theme.spacing(3),
        marginTop: "20px",
    },

    chartArea: {
        padding: theme.spacing(1),
        border: "2px solid grey",
        height: "35vh",
    }

});




class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            registerColor: '',
            registerMessage: '',
            themeColor: '',
            logoEnabled: false,
            categories: [],
            roundAvarageCumulated:0,
            bestValueCumulated:0

        }
    }

    componentDidMount() {
        //get ,
        api.getStatistics((data)=>{
            let roundAvarageCumulated = parseFloat(data.ctrData[data.ctrData.length-1].roundAvarageCumulated).toFixed(2)
            let bestValueCumulated = parseFloat(data.ctrData[data.ctrData.length-1].bestValueCumulated).toFixed(2)

            this.setState({data:data.ctrData, roundAvarageCumulated: roundAvarageCumulated, bestValueCumulated:bestValueCumulated})
        },(error)=>{alert(error)})

    }

    addCategory = (color, name, key = 1) => {

    }

    handleColorChangeComplete = (color) => {
        this.setState({color: color.hex});
    };


    handleLogoEnabledChange = () => {
        if (this.state.logoEnabled)
            this.setState({logoEnabled: false})
        else
            this.setState({logoEnabled: true})
    }


    render() {
        const {classes} = this.props
        return (
            <div className={classes.root}>
                <SettingsContext.Consumer>

                    {(settingsContext) => (
                        <div>
                            <AppBar>
                                <Toolbar>
                                    <Typography variant="h6" noWrap className={classes.AppBoxTitle}>
                                        Ticket Recommender System &nbsp;
                                        <Box color="text.disabled">
                                            Adminstrator
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
                                    {window.sessionStorage.getItem('userRole') ?
                                        <Button href="/" variant="extended" color="" className={classes.adminButton}
                                                startIcon={<WysiwygIcon/>}>
                                            Ticket System
                                        </Button> : <></>}
                                    {settingsContext.settings.logoEnabled ? <CardMedia
                                        className={classes.media}
                                        image={settingsContext.settings.logoFile}
                                        title="image"
                                        component="img"
                                    /> : <div></div>}

                                </Toolbar>
                            </AppBar>
                            <Grid container spacing={3} className={classes.content}>

                                <Grid item xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Grid container>
                                                <Grid item xs={10}>
                                                    <Typography align="center" variant="h5">Bandit
                                                        Performance</Typography>
                                                </Grid>
                                            <Grid item xs={2}></Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Box className={classes.chartArea}>
                                                        <ResponsiveContainer width={"100%"}>
                                                            <LineChart data={this.state.data}
                                                                       margin={{
                                                                           top: 20,
                                                                           right: 20,
                                                                           left: 20,
                                                                           bottom: 20
                                                                       }}>
                                                                <XAxis dataKey="name" interval="preserveStartEnd"><Label
                                                                    position="bottom"
                                                                    value="Iterations"/></XAxis>
                                                                <YAxis label={{
                                                                    value: 'Accuracy Value',
                                                                    angle: -90,
                                                                    position: 'left'
                                                                }}/>
                                                                <CartesianGrid strokeDasharray="3 3"/>
                                                                <Tooltip/>
                                                                <Line dot={false} dataKey="bestValue" stroke="#12dede"/>
                                                                <Line dot={false} dataKey="averageValue" stroke="#fa94ff"/>
                                                                <Line dot={false} dataKey="bestValueCumulated" stroke="#031296"  strokeWidth={3} />
                                                                <Line dot={false} dataKey="roundAvarageCumulated" stroke="#bd0d0d"  strokeWidth={3}/>
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <List>
                                                <ListItem
                                                    secondaryAction={this.state.roundAvarageCumulated}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <FolderIcon/>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primaryTypographyProps={{ style: {fontWeight: 'bold', color: 'grey'} }}
                                                        primary="Cumulated Average Round"
                                                    />
                                                </ListItem>
                                                <ListItem
                                                    secondaryAction={this.state.bestValueCumulated}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <FolderIcon/>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primaryTypographyProps={{ style: {fontWeight: 'bold', color: 'grey'} }}
                                                        primary="Cumulated Best Value"
                                                    />
                                                </ListItem>
                                                {/*
                                                <ListItem
                                                    secondaryAction={"Test"}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <FolderIcon/>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primaryTypographyProps={{ style: {fontWeight: 'bold', color: 'grey'} }}
                                                        primary="Possible Actions"
                                                    />
                                                </ListItem>
                                                <ListItem
                                                    secondaryAction={"Test"}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <FolderIcon/>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primaryTypographyProps={{ style: {fontWeight: 'bold', color: 'grey'} }}
                                                        primary="Unedited Docs"
                                                    />
                                                </ListItem>
                                                <ListItem
                                                    secondaryAction={"Test"}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <FolderIcon/>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primaryTypographyProps={{ style: {fontWeight: 'bold', color: 'grey'} }}
                                                        primary="Deleted Docs"
                                                    />
                                                </ListItem>
                                                <ListItem
                                                    secondaryAction={"Test"}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <FolderIcon/>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primaryTypographyProps={{ style: {fontWeight: 'bold', color: 'grey'} }}
                                                        primary="Other Value"
                                                    />
                                                </ListItem>*/}
                                            </List>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider/>
                                </Grid>
                                <Grid item xs={4}>
                                    <RegisterNewUser/>
                                </Grid>
                                <Grid item xs={8}>
                                    <DefineSettingsComponent context={settingsContext}/>
                                </Grid>
                            </Grid>
                        </div>)}
                </SettingsContext.Consumer>


            </div>
        )
            ;
    }
}

export default withStyles(useStyles)(Admin);

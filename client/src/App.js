import React, {Component} from 'react';
import './App.css';
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import NewTicketSystem from './pages/NewTicketSystem'
import {ThemeProvider, StyledEngineProvider, createTheme} from '@mui/material/styles';
import Login from './pages/Login'
import Admin from './pages/Admin'
import * as session from "./session";
import * as api from "./api";
import {hasSession} from "./session";

const logoThemeEnabled = false

let theme = createTheme();


export const SettingsContext = React.createContext();

/*
const useStyles = makeStyles((theme) => {
    root: {
        // some CSS that access to theme
    }
});
*/


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            settingsExport: {
                settings: {
                    logoEnabled: false,
                    categories: [],
                    logoFile: null,
                    logoFileName: null,
                    colorScheme: "#2196f3"
                },
                updateSettings: this.updateSettings,
            },
            isLoaded: false
        }
    }

    componentDidMount() {
        if(hasSession()){

            api.getSettings((data) => {
                let config = {
                    logoEnabled: data.logoEnabled,
                    categories: data.categories,
                    logoFile: data.logoFile,
                    logoFileName: data.logoFileName,
                    colorScheme: data.colorScheme,
                    predictionsEnabled: data.predictionsEnabled
                }
                theme = createTheme(theme, {
                    palette: {
                        primary: {
                            main: data.colorScheme,
                        },
                        secondary: {
                            main: '#edf2ff',
                        },
                    },
                })


                let settingsExport = this.state.settingsExport
                settingsExport.settings = config
                this.setState({settingsExport: settingsExport, isLoaded: true})

            }, (data, err) => {
                return err
            })
        }
    }

    updateSettings = (settings) => {
        theme = createTheme(theme, {
            palette: {
                primary: {
                    main: settings.colorScheme,
                },
                secondary: {
                    main: '#edf2ff',
                },
            },
        })


        let settingsExport = this.state.settingsExport
        settingsExport.settings = settings
        this.setState({settingsExport: settingsExport})
    }


    render() {
        if (session.hasSession()) {
            if (!this.state.isLoaded) {
                return (<></>)
            } else {
                return (
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={theme}>
                            <SettingsContext.Provider value={this.state.settingsExport}>
                                <BrowserRouter>
                                    <Routes>
                                        {session.hasRole('admin') ?
                                            <>
                                                <Route path="/adminstrator"
                                                       element={<Admin logoThemeEnabled={logoThemeEnabled}/>}/>
                                                <Route index path="/*"
                                                    element={<NewTicketSystem
                                                           logoThemeEnabled={logoThemeEnabled}/>}/>
                                            </> :
                                            <Route index path="/*" element={<NewTicketSystem logoThemeEnabled={logoThemeEnabled}/>}/>
                                        }
                                    </Routes>
                                </BrowserRouter>
                            </SettingsContext.Provider>
                        </ThemeProvider>
                    </StyledEngineProvider>
                )

            }
        } else {
            return (
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <BrowserRouter>
                            <Routes>
                                <Route index path="/*" element={<Login logoThemeEnabled={logoThemeEnabled}/>}/>
                            </Routes>
                        </BrowserRouter>
                    </ThemeProvider>
                </StyledEngineProvider>


            );
        }
    }
}

export default App;

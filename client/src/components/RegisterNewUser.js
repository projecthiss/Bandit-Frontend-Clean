import React, {Component} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as  api from '../api'
import withStyles from '@mui/styles/withStyles';
import {InputLabel, NativeSelect} from "@mui/material";

;

const useStyles = (theme) => ({
    root: {
        display: 'flex',
        userSelect: 'none',
    },
    AppBoxTitle: {
        display: "flex"
    },
    content: {
        padding: theme.spacing(3),
        marginTop: "64px",
    },
});


class RegisterNewUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registerColor: '',
            registerMessage: '',
        }
    }

    handleRegisterSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (data.get('username').length < 4 || data.get('password').length < 4) {
            this.setState({registerMessage: "Username oder Passwort zu kurz"})
            this.setState({registerColor: "error.main"})

        } else {
            api.register(data.get('username'), data.get('password'), data.get('userRole'), () => {
                // SUCCESS
                this.setState({registerColor: "#000000"})
                this.setState({registerMessage: "Registrierung von " + data.get('username') + " erfolgreich"})
            }, (err) => {
                // ERRROR
                this.setState({registerMessage: "Registrierung gescheitert. Dies kann daran liegen, dass der Username (" + data.get('username') + ")bereits vergeben ist"})
                this.setState({registerColor: "error.main"})
                //console.log(err)
            })
        }
        ;
    };


    render() {
        const {classes} = this.props

        return (
            <div className={classes.root}>

                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h6" noWrap className={classes.AppBoxTitle}>
                            Register New User
                        </Typography>
                        <Box component="form" noValidate onSubmit={this.handleRegisterSubmit} sx={{mt: 1}}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                inputProps={{minLength: 5}}
                                autoComplete="username"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="text"
                                id="password"
                                inputProps={{minLength: 5}}
                            />
                            <Grid container>
                                <Grid item xs={2}>
                                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                        Role
                                    </InputLabel>
                                    <NativeSelect
                                        defaultValue={'user'}
                                        inputProps={{
                                            name: 'userRole',
                                            id: 'uncontrolled-native',
                                        }}
                                    >
                                        <option value={"user"}>User</option>
                                        <option value={"admin"}>Admin</option>
                                    </NativeSelect>
                                </Grid>

                                <Grid item xs={10}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{mt: 3, mb: 2}}
                                    >
                                        Register new User
                                    </Button>
                                </Grid>
                                <Typography sx={{color: this.state.registerColor}}>
                                    {this.state.registerMessage}
                                </Typography>
                            </Grid>
                        </Box>

                    </Grid>
                </Grid>
            </div>
        )
            ;
    }
}

export default withStyles(useStyles)(RegisterNewUser);

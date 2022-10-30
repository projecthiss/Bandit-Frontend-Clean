import React, {Component} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import * as  api from '../api'
import withStyles from '@mui/styles/withStyles';

const useStyles = (theme) => ({
    root: {
        display: 'flex',
        userSelect: 'none',
    },

});

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage:''
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        api.login(data.get('username'), data.get('password'), () => {
            // SUCCESS
            window.location = '/'
        }, (err) => {
            // ERRROR
            this.setState({errorMessage:"Login gescheitert"})
            //console.log(err)
        })
        //console.log({
        //    username: data.get('username'),
        //    password: data.get('password'),
        //});
    };


    render() {
        const {classes} = this.props


        return (
            <div className={classes.root}>
                <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: 'url('+process.env.PUBLIC_URL + 'loginImage.jpg)',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography mb={3} component="h1" variant="h4">
                                Ticket Recommender System
                            </Typography>
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <Box component="form" noValidate onSubmit={this.handleSubmit} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                                <Typography sx={{color: 'error.main'}}>
                                    {this.state.errorMessage}
                                </Typography>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign In
                                </Button>

                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(useStyles)(Login);

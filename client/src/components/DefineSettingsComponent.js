import React, {Component, useContext} from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';
import {MaterialPicker} from 'react-color';
import List from '@mui/material/List'
import PublishIcon from '@mui/icons-material/Publish';
import {AppBar, CardMedia, Checkbox} from "@mui/material";
import {FormControlLabel} from "@mui/material";
import Divider from "@mui/material/Divider";
import CategorySettingsComponent from "../components/CategorySettingsComponent";
import {Box} from '@mui/material/';
import ImageUploadBotton from './ImageUploadButton'
import * as api from "../api";


const useStyles = (theme) => ({
    root: {
        display: 'flex',
        userSelect: 'none',
    },
    AppBoxTitle: {
        display: "flex"
    },
    saveButton: {
        marginTop: theme.spacing(2)
    },
    media: {
        maxHeight: 50,
        maxWidth: 140,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    logoPadding:{
        padding:theme.spacing(1)
    }

});

const getCategoryItem = (color, categoryName) => {
    return {
        color: color,
        categoryName: categoryName,
        key: categoryName.toLowerCase().replace(/\s/g, '')
    }
}


class DefineSettingsComponent extends Component {

    constructor(props) {
        super(props);
        this.settingsExport = this.props.context
    }


    addCategory = (color, name, counter = 1) => {
        let tempArr = this.settingsExport.settings.categories
        let nameNew = name + ' ' + counter
        if (tempArr.some(e => e.key === name.toLowerCase().replace(/\s/g, '')) || tempArr.some(e => e.key === nameNew.toLowerCase().replace(/\s/g, ''))) {

            if (name.substring(0, 12) == 'New Category') {
                this.addCategory(color, name, counter + 1)
            } else {
                alert("Dieser Kategoriename wurde bereits vergeben")
            }
        } else {
            if (name.substring(0, 12) == 'New Category') {


                tempArr.push(getCategoryItem(color, name + " " + counter))
            } else {
                tempArr.push(getCategoryItem(color, name))
                this.categories = tempArr
            }
            this.settingsExport.settings.categories = tempArr
            this.settingsExport.updateSettings(this.settingsExport.settings)
        }

    }

    handleColorChangeComplete = (color) => {
        this.settingsExport.settings.colorScheme = color.hex
        this.settingsExport.updateSettings(this.settingsExport.settings)
    };


    handleLogoEnabledChange = () => {
        if (this.settingsExport.settings.logoEnabled) {
            this.settingsExport.settings.logoEnabled = false
            this.settingsExport.updateSettings(this.settingsExport.settings)
        } else {
            this.settingsExport.settings.logoEnabled = true
            this.settingsExport.updateSettings(this.settingsExport.settings)
        }
    }
    handlePredictionsEnabled = () =>{
        if (this.settingsExport.settings.predictionsEnabled) {
            this.settingsExport.settings.predictionsEnabled = false
            this.settingsExport.updateSettings(this.settingsExport.settings)
        } else {
            this.settingsExport.settings.predictionsEnabled = true
            this.settingsExport.updateSettings(this.settingsExport.settings)
        }

    }

    deleteCategory = (index) => {
        let tempArray = this.settingsExport.settings.categories
        tempArray.splice(index, 1)
        this.settingsExport.settings.categories = tempArray
        this.settingsExport.updateSettings(this.settingsExport.settings)
    }
    colorChanged = (index, color) => {
        this.settingsExport.settings.categories[index].color = color
        this.settingsExport.updateSettings(this.settingsExport.settings)
    }
    categoryNameChanged = (index, name) => {
        let tempArr = this.settingsExport.settings.categories
        let checkArray = [...tempArr]
        checkArray.splice(index, 1)
        if (checkArray.some(e => e.key === name.toLowerCase().replace(/\s/g, ''))) {
            alert("Dieser Kategoriename wurde bereits vergeben")
        } else {
            tempArr[index].categoryName = name
            tempArr[index].key = name.toLowerCase().replace(/\s/g, '')
            this.settingsExport.settings.categories = tempArr
            //this.settingsExport.updateSettings(this.settingsExport.settings)

        }
    }
    selectFile = (file) => {
        this.settingsExport.settings.logoEnabled = true
        this.settingsExport.settings.logoFileName = file.name
        this.settingsExport.settings.logoFile = file.base64
        this.settingsExport.updateSettings(this.settingsExport.settings)

        //this.setState({currentFile: e.target.files[0], fileName: e.target.files[0].name})
        //let formData = new FormData()
        //formData.append('file',  e.target.files[0],  e.target.files[0].name)
        //console.log(formData)
    }
    saveSettings = () => {
        api.setSettings(this.settingsExport.settings.categories, this.settingsExport.settings.colorScheme, this.settingsExport.settings.predictionsEnabled, this.settingsExport.settings.logoEnabled, this.settingsExport.settings.logoFileName, this.settingsExport.settings.logoFile, () => {
            // SUCCESS
            alert("Speichern erfolgreich")
            window.location.reload()
        }, (err) => {
            // ERRROR
            alert("Speichern Fehlgeschlagen")
            //console.log(err)
        })
    }

    render() {
        const {classes} = this.props

        return (
            <div className={classes.root}>


                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" noWrap className={classes.AppBoxTitle}>
                            Ticket Recommender System Settings
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid spacing={1} container>

                            <Grid item xs={6}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Typography>Set Scheme Color</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <MaterialPicker color={this.settingsExport.settings.colorScheme}
                                                        onChangeComplete={this.handleColorChangeComplete}
                                                        height="400pxs"
                                                        width="100%"/>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Typography>Logo Settings</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.settingsExport.settings.logoEnabled}
                                                          disabled={this.settingsExport.settings.logoFile == null ? true : false}
                                                          onChange={this.handleLogoEnabledChange}
                                                          name="Logo Enabled"/>
                                            }
                                            label="Logo Enabled"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>

                                        <ImageUploadBotton multiple={false} onDone={this.selectFile}/>

                                        <Typography>
                                            {this.settingsExport.settings.logoFileName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>

                                <Box style={{
                                    backgroundColor: this.settingsExport.settings.colorScheme,
                                    borderRadius: "4px"
                                }}>
                                    <div className={classes.logoPadding}>
                                        {this.settingsExport.settings.logoFile != null ?
                                            <CardMedia
                                                className={classes.media}
                                                image={this.settingsExport.settings.logoFile}
                                                title="image"
                                                component="img"
                                            />
                                            : <CardMedia
                                                classes={{media: classes.media}}
                                                image={process.env.PUBLIC_URL + '/logoPlaceHolder.png'}

                                                title="image"
                                                component="img"
                                            />
                                        }
                                    </div>

                                </Box>
                                <Grid item xs={12}>
                                    <Typography>Predictions Enabled</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={this.settingsExport.settings.predictionsEnabled}
                                                      onChange={this.handlePredictionsEnabled}
                                                      name="Predictions Enabled"/>
                                        }
                                        label="Predictions Enabled"
                                    />
                                </Grid>



                            </Grid>
                        </Grid>
                    </Grid>


                    <Grid item xs={8}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography>Categories</Typography>
                            </Grid>
                        </Grid>
                        <List>
                            <Divider/>
                            {
                                this.settingsExport.settings.categories.map((item, index) => (
                                        <CategorySettingsComponent deleteCategory={() => {
                                            this.deleteCategory(index)
                                        }}
                                                                   key={item.key}
                                                                   color={item.color}
                                                                   categoryName={item.categoryName}
                                                                   categoryNameChanged={(event) => {
                                                                       this.categoryNameChanged(index, event.target.value)
                                                                   }}
                                                                   colorChanged={(color) => this.colorChanged(index, color)}/>
                                    )
                                )}

                        </List>


                        <Button onClick={() => {
                            this.addCategory('ffd180', 'New Category')
                        }} variant={"outlined"}>Add Category</Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            className={classes.saveButton}
                            fullWidth
                            variant="contained"
                            onClick={this.saveSettings}
                        >
                            Save Settings
                        </Button>
                    </Grid>
                </Grid>

            </div>
        )

    }
}

export default withStyles(useStyles)(DefineSettingsComponent);

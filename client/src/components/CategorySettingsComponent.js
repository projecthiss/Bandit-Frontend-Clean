import React, {Component, useState} from 'react';
import withStyles from '@mui/styles/withStyles';
import ListItemIcon from "@mui/material/ListItemIcon";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import CloseIcon from '@mui/icons-material/Close';
import {Divider, Popover, Typography, IconButton, TextField} from "@mui/material";
import {BlockPicker} from "react-color";

const fontColor = {
    style: {color: 'rgb(50, 50, 50)'}
}

const useStyles = (theme) => ({
    example: {
        marginLeft: theme.spacing(2)
    }

})



class CategorySettingsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            key: this.props.key,
            color: this.props.color,
            categoryName: this.props.categoryName,
            popOverOpen: false,
            anchorEl:null,
            colorExamples:['#ff8a80','#ff80ab','#ea80fc', '#b388ff',
                '#8c9eff', '#82b1ff','#80d8ff','#84ffff',
                '#a7ffeb','#b9f6ca','#ccff90',
            '#ffff8d','#ffe57f','#ffd180','#ff9e80']
        }

        ;
    }


    componentWillReceiveProps(nextProps) {
        this.setState({color: nextProps.color,
            categoryName: nextProps.categoryName})
        //console.log("update")
    }
    handlePopOver = (event) => {
        if(this.state.popOverOpen)
            this.setState({popOverOpen: false});
        else
            this.setState({anchorEl: event.currentTarget,    popOverOpen: true});


    };


    handleColorChangeComplete = (color) => {
        this.props.colorChanged(color.hex)
        this.setState({ color: color.hex });

    };
    handleChange = (event) => {
        this.setState({categoryName: event.target.value});
    };

    render() {
        const {classes} = this.props
        return (
            <div>

                <ListItem  key={this.state.key}>
                    <IconButton onClick={this.props.deleteCategory} >
                        <CloseIcon/>
                    </IconButton>
                        <IconButton onClick={this.handlePopOver} >
                        <FiberManualRecordIcon style={{color: this.state.color}}/>
                        </IconButton>
                    <Popover
                        anchorEl={this.state.anchorEl}
                        open={this.state.popOverOpen}
                        onClose={this.handlePopOver}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <BlockPicker
                            colors={this.state.colorExamples}
                            color={ this.state.color }
                            onChangeComplete={this.handleColorChangeComplete}/>
                    </Popover>

                        <TextField
                              size="small"  value={this.state.categoryName} onChange={(e)=>{this.handleChange(e);
                            this.props.categoryNameChanged(e)}}/>

                    <Typography className={classes.example}>Beispiel <span style={{ backgroundColor: this.state.color}}>Text mit</span> Highlighting.</Typography>
                </ListItem>
            <Divider/>
            </div>
        );
    }
}

export default withStyles(useStyles)(CategorySettingsComponent);
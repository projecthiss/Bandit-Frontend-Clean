import React from 'react';
import Button from "@mui/material/Button";
import PublishIcon from "@mui/icons-material/Publish";
import {styled} from "@mui/material/styles";


const Input = styled('input')({
    display: 'none',
});
export default class FileBase64 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
        };
    }

    handleChange(e) {

        // get the files
        let files = e.target.files;

        // Process each file
        var allFiles = [];
        for (var i = 0; i < files.length; i++) {

            let file = files[i];

            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {

                // Make a fileInfo Object
                let fileInfo = {
                    name: file.name,
                    type: file.type,
                    size: Math.round(file.size / 1000) + ' kB',
                    base64: reader.result,
                    file: file,
                };

                // Push it to the state
                allFiles.push(fileInfo);

                // If all files have been proceed
                if(allFiles.length == files.length){
                    // Apply Callback function
                    if(this.props.multiple) this.props.onDone(allFiles);
                    else this.props.onDone(allFiles[0]);
                }

            } // reader.onload

        } // for

    }

    render() {
        return (
            <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" multiple={ this.props.multiple }  type="file" onChange={ this.handleChange.bind(this) }/>
                <Button variant="outlined" component="span"
                        startIcon={<PublishIcon/>}>
                    Upload
                </Button>
            </label>
        );
    }
}
FileBase64.defaultProps = {
    multiple: false,
};
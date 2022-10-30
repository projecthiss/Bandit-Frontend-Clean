import React, {Component} from 'react';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {Rating} from "@mui/material";
import CustomModal from "./CustomModal";

const useStyles = (theme) => ({
    card: {
        maxWidth: 345,
    },


});


class CardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticket: this.props.ticket,
            editedText: ""
        }
    }

    componentDidMount() {
        console.log("Card Received")
        this.getHighlightedText((t) => {
            this.setState({editedText: t})
        })
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log("Card Received")
        this.setState({ticket: nextProps.ticket}, () => {
                this.getHighlightedText((t) => {
                    this.setState({editedText:t })
                })
            }
        )
    }


    getHighlightedText = (cb) => {
        let textedit = this.state.ticket.question
        let text = ""
        if (this.state.ticket.markupNFormat === undefined) {
            text = textedit
            this.setState({editedText: text}, () => {
                cb(text)
            })
        } else {
            //console.log(this.state.ticket)
            let markup = this.state.ticket.markupNFormat.sort((a, b) => parseFloat(b.end) - parseFloat(a.end));
            text = textedit
            for (let a of markup) {
                text = [text.slice(0, a.end), "</span>", text.slice(a.end)].join('');
                text = [text.slice(0, a.start), "<span style='background-color: " + a.color + "'>", text.slice(a.start)].join('');
            }
            this.setState({editedText: text}, () => {
                cb(text)
            })
        }
    }

    render() {
        const {classes} = this.props

        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardActionArea onClick={() => this.openCustomModal()}>
                        <CardContent>
                            {/*<Typography gutterBottom variant="p" noWrap={true}>
                                Probalitiy: {parseFloat(this.props.probability*100).toFixed(2)+"%"}
                            </Typography>
                            */}
                            <Typography gutterBottom variant="h5" component="h2" noWrap={true}>
                                {this.state.ticket.main_category+'/'+this.state.ticket.category_1+'/'+this.state.ticket.category_2+'/'+this.state.ticket.category_3}
                            </Typography>
                            <Typography component="p" noWrap={true}>
                                {this.state.ticket.report}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions sx={{justifyContent: 'space-between'}}>
                        <Rating name="no-value" value={this.props.rating} onChange={(event, newValue) => {
                            this.props.updateRating(newValue)
                        }}/>
                        <CustomModal setClick={click => this.openCustomModal = click}
                                     exception={true}
                                     getMarkUpTFormat={() => {
                                         this.props.getMarkUpTFormat()
                                     }}
                                     resultContent={true}
                                     openedTicket={this.state.ticket}
                                     editedText={this.state.editedText}

                        />
                        {/*<Button size="small" color="primary">
                            Show Full Ticket
                        </Button>*/}
                    </CardActions>
                </Card>


            </div>
        )
    }
}

export default withStyles(useStyles)(CardComponent);
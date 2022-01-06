import React from "react";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FastForwardIcon from "@material-ui/icons/FastForward";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import PlayerArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import VolumeUp from "@material-ui/icons/VolumeUp";
import FullScreenIcon from "@material-ui/icons/Fullscreen";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import VolumeOff from "@material-ui/icons/VolumeOff";

const useStyles = makeStyles({
    playerWrapper: {
        width: "100%",
        position: "relative",
        height: "400px",
    },
    controlWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgbe (0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 1,
    },
    controlIcons: {
        color: "#777",
        fontSize: 50,
        transform: "scale(0.9)",
        "&:hover": {
            color: "#fff",
            transform: "scale(1)",
        },
    },
    bottomIcon: {
        color: "#999",
        "&:hover": {
            color: "#fff",
        },
    },
    volumeSlider: {
        width: 100,
    },
});

function ValueLabelComponent(props) {
    const {children, open, value} = props;
    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

const PrettoSlider = withStyles({
    root: {
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: "#fff",
        border: "2px solid currentColor",
        marginTop: -8,
        marginLeft: -12,
        "&:focus, &:hover, &$active": {
            boxShadow: "inherit",
        },
    },
    active: {},
    valueLabel: {
        left: "calc(-50% + 4px)",
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);

export default function Playcontrol({
                                        onPlayPause,
                                        playing,
                                        onRewind,
                                        onFastForward,
                                        muted,
                                        onMute,
                                        onVolumeChange,
                                        onVolumeSeekUp,
                                        volume,
                                        onPlaybackRateChange,
                                        playbackRate,
                                        onToggleFullScreen,
                                        played,
                                        onSeek,
                                        onSeekMouseDown,
                                        onSeekMouseUp,
                                        elapsedTime,
                                        totalDuration,
                                        onChangeDisplayFormat,
                                        onBookmark,
                                    }) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? "playbackrate-popover" : undefined;

    return (
        <div className={classes.controlWrapper}>
            <Grid
                container
                direction="row"
                alignItems="center"
                justify="space-between"
                style={{padding: 16}}
            >
                <Grid item>
                    <h5 style={{color: "#fff"}}>Video Title</h5>
                </Grid>
                {/* <Grid item>
          <Button
            onClick={onBookmark}
            variant="contained"
            color="primary"
            startIcon={<BookmarkIcon />}
          >
            bookmark
          </Button>
        </Grid> */}
            </Grid>

            {/* middle control */}
            <Grid container direction="row" alignItems="center" justify="center">
                <IconButton
                    onClick={onRewind}
                    className={classes.controlIcons}
                    aria-label="reqind"
                >
                    <FastRewindIcon fontSize="inherit"/>
                </IconButton>

                <IconButton
                    onClick={onPlayPause}
                    className={classes.controlIcons}
                    aria-label="reqind"
                >
                    {playing ? (
                        <PauseIcon fontSize="inherit"/>
                    ) : (
                        <PlayerArrowIcon fontSize="inherit"/>
                    )}
                </IconButton>

                <IconButton
                    onClick={onFastForward}
                    className={classes.controlIcons}
                    aria-label="reqind"
                >
                    <FastForwardIcon fontSize="inherit"/>
                </IconButton>
            </Grid>

            {/* bottom controls */}
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                style={{padding: 12}}
            >
                <Grid item xs={12}>
                    <PrettoSlider
                        min={0}
                        max={100}
                        value={played * 100}
                        ValueLabelComponent={(props) => (
                            <ValueLabelComponent {...props} value={elapsedTime}/>
                        )}
                        onChange={onSeek}
                        onMouseDown={onSeekMouseDown}
                        onChangeCommitted={onSeekMouseUp}
                    />
                    <Grid container alignItems="center" direction="row">
                        <IconButton onClick={onPlayPause} className={classes.bottomIcon}>
                            {playing ? (
                                <PauseIcon fontSize="large"/>
                            ) : (
                                <PlayerArrowIcon fontSize="large"/>
                            )}
                        </IconButton>

                        <IconButton onClick={onMute} className={classes.bottomIcon}>
                            {muted ? (
                                <VolumeOff fontSize="large"/>
                            ) : (
                                <VolumeUp fontSize="large"/>
                            )}
                        </IconButton>

                        <Slider
                            min={0}
                            max={100}
                            Value={volume * 100}
                            className={classes.volumeSlider}
                            onChange={onVolumeChange}
                            onChangeCommitted={onVolumeSeekUp}
                        />

                        <Button
                            onClick={onChangeDisplayFormat}
                            variant="text"
                            style={{color: "#c4c4c4", marginLeft: 16}}
                        >
                            {elapsedTime} / {totalDuration}
                        </Button>
                        <Grid item>
                            <Button
                                onClick={handlePopover}
                                variant="text"
                                className={classes.bottomIcon}
                            >
                                1X
                            </Button>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                }}
                                transformOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                            >
                                <Grid container direction="column-reverse">
                                    {[0.5, 1, 1.5, 2].map((rate) => (
                                        <Button
                                            onClick={() => onPlaybackRateChange(rate)}
                                            variant="text"
                                        >
                                            <Typography
                                                color={rate === playbackRate ? "secondary" : "default"}
                                            >
                                                {rate}
                                            </Typography>
                                        </Button>
                                    ))}
                                </Grid>
                            </Popover>
                            <IconButton
                                onClick={onToggleFullScreen}
                                className={classes.bottomIcon}
                            >
                                <FullScreenIcon fontSize="large"/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

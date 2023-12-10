import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faVideo,
  faDesktop,
  faVideoSlash,
  faMicrophoneSlash,
  faLink,
  faLinkSlash,
  faAlignLeft,
  faSlash,
  faCamera,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import "./MeetingFooter.css";
import { Link } from "react-router-dom";
const MeetingFooter = (props) => {
  const [streamState, setStreamState] = useState({
    mic: true,
    video: false,
    screen: false,
  });
  const micClick = () => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        mic: !currentState.mic,
      };
    });
  };

  const onVideoClick = () => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        video: !currentState.video,
      };
    });
  };

  const onScreenClick = () => {
    props.onScreenClick(setScreenState);
  };

  const setScreenState = (isEnabled) => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        screen: isEnabled,
      };
    });
  };
  useEffect(() => {
    props.onMicClick(streamState.mic);
  }, [streamState.mic]);
  useEffect(() => {
    props.onVideoClick(streamState.video);
  }, [streamState.video]);
  return (
    <div className="meeting-footer border-t">
      <div
        className={"meeting-icons " + (!streamState.mic ? "active" : "")}
        data-tip={streamState.mic ? "Mute Audio" : "Unmute Audio"}
        onClick={micClick}
      >
        <FontAwesomeIcon
          icon={!streamState.mic ? faMicrophoneSlash : faMicrophone}
          title="Mute"
        />
      </div>
      <div
        className={"meeting-icons " + (!streamState.video ? "active" : "")}
        data-tip={streamState.video ? "Hide Video" : "Show Video"}
        onClick={onVideoClick}
      >
        <FontAwesomeIcon icon={!streamState.video ? faVideoSlash : faVideo} />
      </div>
      <div
        className={"meeting-icons"}
        onClick={onVideoClick}
      >
        <FontAwesomeIcon icon={faCamera} />
      </div>
      <Link to='summary'>
        <div
          className={"meeting-icons active"}
          onClick={onVideoClick}
        >
          <FontAwesomeIcon icon={faPhone} />
        </div>
      </Link>
      <div
        className="meeting-icons"
        data-tip="Share Screen"
        onClick={onScreenClick}
        disabled={streamState.screen}
      >
        <FontAwesomeIcon icon={faDesktop} />
      </div>
      <div className={"meeting-icons " + (props.meetingState.meetingInfo ? "" : "active")}
        data-tip="Link Info"
        onClick={() =>
          props.setMeetingState((prev) => ({
            ...prev,
            meetingInfo: !prev.meetingInfo,
          }))
        }
        disabled={streamState.screen}
      >
        <FontAwesomeIcon
          icon={
            props.meetingState.meetingInfo ? faLink : faLinkSlash
          }
        />
      </div>
      <div className={"meeting-icons " + (props.meetingState.transcription ? "" : "active")}
        data-tip="Link Info"
        onClick={() =>
          props.setMeetingState((prev) => ({
            ...prev,
            transcription: !prev.transcription,
          }))
        }
        disabled={streamState.screen}
      >
        {props.meetingState.transcription ? (
          <FontAwesomeIcon icon={faAlignLeft} />
        ) : (
          <>
            <FontAwesomeIcon
              icon={faSlash}
              className="overlay-icon"
              style={{ position: "absolute" }}
            />
            <FontAwesomeIcon
              icon={faAlignLeft}
              style={{ position: "relative" }}
            />
          </>
        )}
      </div>
      <ReactTooltip />
    </div>
  );
};

export default MeetingFooter;

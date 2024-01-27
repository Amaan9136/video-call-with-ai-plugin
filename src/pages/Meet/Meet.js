import { useEffect, useContext } from "react";
import { connect } from "react-redux";
import MainScreen from "../../components/MainScreen/MainScreen.component";
import firepadRef, { db } from "../../server/firebase";
import { AppContext } from '../../AppContext';
import Loader from '../../AppLoader';
// import { startVideoRecording } from '../../server/http';

import {
  addParticipant,
  removeParticipant,
  setMainStream,
  setUser,
  updateParticipant,
} from "../../store/actioncreator";
import "./Meet.css";
// import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";

function Meet(props) {
  const { appState, setAppState, setHostDetails } = useContext(AppContext);
  useEffect(() => {
    setAppState((prevAppState) => ({
      ...prevAppState,
      loaderShow: true,
    }));
    const loaderTimeout = setTimeout(() => {
      setAppState((prevAppState) => ({
        ...prevAppState,
        loaderShow: false,
      }));
    }, 1500);

    return () => {
      clearTimeout(loaderTimeout);
    };
  }, [setAppState]);

  const { name, setMainStream, setUser, addParticipant, removeParticipant, updateParticipant } = props;
  const getUserStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    return localStream;
  };

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      try {
        const stream = await getUserStream();
        if (isSubscribed) {
          stream.getVideoTracks()[0].enabled = false;
          setMainStream(stream);
          const connectedRef = await db.database().ref(".info/connected");
          const participantRef = firepadRef.child("participants");
          const snapshot = await participantRef.once("value");
          const participantsArray = Object.values(snapshot.val() || {});
          const isHostUndefined = participantsArray.some(participant => participant.isHost);
          const hostRef = firepadRef.child("host");
          const hostSnapshot = await hostRef.once("value");

          connectedRef.on("value", (snap) => {
            if (snap.val()) {
              const defaultPreference = {
                audio: true,
                video: false,
                screen: false,
              };
              const userStatusRef = participantRef.push({
                userName: name,
                preferences: defaultPreference,
                isHost: !isHostUndefined,
              });
              setUser({
                [userStatusRef.key]: { name, ...defaultPreference },
              });
              
              if (!isHostUndefined) {
                // !isHostUndefined means - it is HOST, set the host's data
                const hostStatusRef = firepadRef.child("host").push({
                  id: userStatusRef.key,
                  userName: name,
                });
                setHostDetails({ id: userStatusRef.key, name, isHost: !isHostUndefined });
                hostStatusRef.onDisconnect().remove();
              }else{  
                // this is NOT HOST, gets the host data
                const dbHostDataArray = Object.values(hostSnapshot.val() || {});
                const dbHostData = dbHostDataArray[0];
                if (dbHostData) {
                  setHostDetails({
                    id: dbHostData.id,
                    name: dbHostData.userName,
                  });
                }
              }
              userStatusRef.onDisconnect().remove();
            }
          });
          participantRef.on("child_added", (snap) => {
            const preferenceUpdateEvent = participantRef.child(snap.key).child("preferences");
            preferenceUpdateEvent.on("child_changed", (preferenceSnap) => {
              updateParticipant({
                [snap.key]: {
                  [preferenceSnap.key]: preferenceSnap.val(),
                },
              });
            });
            const { userName: name, preferences = {} } = snap.val();
            addParticipant({
              [snap.key]: {
                name,
                ...preferences,
              },
            });
          });
          participantRef.on("child_removed", (snap) => {
            removeParticipant(snap.key);
          });
          window.history.replaceState(null, "Meet", "?id=" + firepadRef.key);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    return () => {
      isSubscribed = false;
    };
  }, [name, setMainStream, setUser, addParticipant, removeParticipant, updateParticipant , setHostDetails]);

  // useEffect(() => {
  //   startVideoRecording();
  // }, []);
  
  return (
    <div className="Meet">
      {appState.loaderShow ? (
        <Loader message={"Arranging Meeting..."} />
      ) : (
        // <ErrorHandler>
          <MainScreen name={name} />
        /* </ErrorHandler> */
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    stream: state && state.mainStream ? state.mainStream : null,
    user: state && state.currentUser ? state.currentUser : null,
  };
};

const mapDispatchToProps = {
  setMainStream,
  addParticipant,
  setUser,
  removeParticipant,
  updateParticipant,
};

export default connect(mapStateToProps, mapDispatchToProps)(Meet);

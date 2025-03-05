import { useEffect, useRef } from 'react';
import socket from '../../utils/testSocket';
import styles from './VideoConference.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface VideoConferenceProps {
    roomId: string;
    participants: string[];
}

const VideoConference = ({ roomId, participants }: VideoConferenceProps) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideosRef = useRef<{ [key: string]: HTMLVideoElement }>({});
    const { user } = useSelector((state: RootState) => state.auth);
    const remoteStreams = useRef<{ [key: string]: MediaStream }>({});

    useEffect(() => {
        const peerConnections: { [key: string]: RTCPeerConnection } = {};
        
        const localStreamPromise = navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        const handleOffer = async ({ offer, participantId: offerParticipantId }: 
            { offer: RTCSessionDescriptionInit, participantId: string }) => {
            if (peerConnections[offerParticipantId]) {
                try {
                    await peerConnections[offerParticipantId].setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await peerConnections[offerParticipantId].createAnswer();
                    await peerConnections[offerParticipantId].setLocalDescription(answer);
                    socket.emit('answer', { answer, participantId: offerParticipantId, roomId });
                } catch (error) {
                    console.error('Error handling offer:', error);
                }
            }
        };

        const handleAnswer = async ({ answer, participantId: answerParticipantId }: 
            { answer: RTCSessionDescriptionInit, participantId: string }) => {
            if (peerConnections[answerParticipantId]) {
                try {
                    await peerConnections[answerParticipantId].setRemoteDescription(new RTCSessionDescription(answer));
                } catch (error) {
                    console.error('Error handling answer:', error);
                }
            }
        };

        const handleSignal = (signal: { candidate: RTCIceCandidateInit, participantId: string }) => {
            if (peerConnections[signal.participantId] && signal.candidate) {
                peerConnections[signal.participantId].addIceCandidate(new RTCIceCandidate(signal.candidate))
                    .catch(error => console.error('Error adding ICE candidate:', error));
            }
        };

        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('signal', handleSignal);

        localStreamPromise.then((stream) => {
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            participants.forEach((participantId) => {
                const peerConnection = new RTCPeerConnection();
                peerConnections[participantId] = peerConnection;

                stream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, stream);
                });

                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('signal', { roomId, candidate: event.candidate, participantId });
                    }
                };

                peerConnection.ontrack = (event) => {
                    remoteStreams.current[participantId] = event.streams[0];
                    if (remoteVideosRef.current[participantId]) {
                        remoteVideosRef.current[participantId].srcObject = remoteStreams.current[participantId];
                    }
                };
                peerConnection.onnegotiationneeded = async () => {
                    try {
                      const offer = await peerConnection.createOffer();
                      await peerConnection.setLocalDescription(offer);
                      socket.emit('offer', { offer, participantId, roomId });
                    } catch (error) {
                      console.error('Error during negotiation:', error);
                    }
                  };

                peerConnection.createOffer().then((offer) => {
                    peerConnection.setLocalDescription(offer);
                    socket.emit('offer', { offer, participantId, roomId });
                }).catch(error => console.error('Error creating offer:', error));
            });
        }).catch((error) => {
            console.error('Error getting media stream:', error);
        });

        return () => {
            localStreamPromise.then((stream) => {
                stream.getTracks().forEach((track) => track.stop());
            });

            Object.values(peerConnections).forEach((peerConnection) => {
                peerConnection.close();
            });

            socket.off('offer', handleOffer);
            socket.off('answer', handleAnswer);
            socket.off('signal', handleSignal);
        };
    }, [participants]);

    return (
        <div>
            <video ref={localVideoRef} autoPlay muted></video>
            <div className={styles.remoteVideos}>
                {
                participants
                    .filter(id => id !== user?._id)
                    .map((participantId) => (
                    <video
                        className={styles.video}
                        key={participantId}
                        ref={(ref) => {
                            if (ref) {
                                remoteVideosRef.current[participantId] = ref;
                                if (remoteStreams.current[participantId]) {
                                    ref.srcObject = remoteStreams.current[participantId];
                                }
                            } else {
                                delete remoteVideosRef.current[participantId];
                            }
                        }}
                        autoPlay
                    ></video>
                ))}
            </div>
        </div>
    );
};

export default VideoConference;
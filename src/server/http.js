export const downloadVideo = async (setAppState) => {
  setAppState(prevState => ({
    ...prevState,
    model: {
      ...prevState.model,
      showModel: true,
      modelNeedInput: false,
      modelMsg: "Downloading the Session may take time. Please do not close the browser!"
    },
  }));
  try {
    const response = await fetch('http://127.0.0.1:5000/download-video', {
      method: 'GET'
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'output.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Failed to download video:', response.statusText);
    }
  } catch (error) {
    console.error('Error downloading video:', error);
  }
};


export const startVideoRecording = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/start-record`, {
      method: 'GET'
    });
    if (response.ok) {
      console.log('Video recording started successfully');
    } else {
      console.error('Failed to start video recording:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error starting video recording:', error);
  }
};

export const stopVideoRecording = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/stop-record", {
      method: 'GET'
    });
    if (response.ok) {
      console.log('Video recording stopped successfully');
    } else {
      console.error('Failed to stop video recording:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error stopping video recording:', error);
  }
};

export function handleSendMail(setAppState, title, message) {
  fetch('http://127.0.0.1:5000/send-mail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, message }),
  })
    .then(response => response.text())
    .then(data => {
      setAppState(prevState => ({
        ...prevState,
        loaderShow: false,
        model: {
          ...prevState.model,
          showModel: true,
          modelNeedInput: false,
          modelMsg: data,
        },
      }));
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
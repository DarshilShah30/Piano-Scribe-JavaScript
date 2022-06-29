
let noteSequence; 


const model = initModel();

// event listener for upload button
fileInput.addEventListener("change", (e) => {
  updateWorkingState(btnUpload);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      transcribeFromFile(e.target.files[0]);
      fileInput.value = null;
    })
  );

  return false;
});


// function to convert to midi
async function transcribeFromFile(blob) {
  hideResult();

  model.transcribeFromAudioFile(blob).then((ns) => {
    
    noteSequence = ns;
    resetUIState();
    showResult();

  });
}



function updateWorkingState(active, inactive) {

  transcribingMessage.hidden = false;
  active.classList.add("working");

}


function resetUIState() {
  btnUpload.classList.remove("working");
  btnUpload.removeAttribute("disabled");
}

function hideResult() {
  saveBtn.hidden = true;
  container.hidden = true;
  done.hidden = true;
}

// renders when conversion is complete
function showResult() {
  document.getElementById('done').innerText = "Done Transcribing!!!";
  container.hidden = false;
  saveBtn.hidden = false;
  done.hidden = false;
  transcribingMessage.hidden = true;
}

// Download midi file on save button press
function saveMidi(event) {
  event.stopImmediatePropagation();
  document.getElementById('done').innerText = "Saved!!";
  saveAs(
    new File(
      [mm.sequenceProtoToMidi(noteSequence)],
      "transcription.mid"
    )
  );
}

// initialize majenta js model
function initModel() {
  const model = new mm.OnsetsAndFrames(
    "https://storage.googleapis.com/magentadata/js/checkpoints/transcription/onsets_frames_uni"
  );

  model.initialize().then(() => {
    resetUIState();
    modelLoading.hidden = true;
    modelReady.hidden = false;
  });

  // Things are slow on Safari.
  if (window.webkitOfflineAudioContext) {
    safariWarning.hidden = false;
  }

  // Things are very broken on ios12.
  if (navigator.userAgent.indexOf("iPhone OS 12_0") >= 0) {
    iosError.hidden = false;
    buttons.hidden = true;
  }
  return model;
}

function removetext() {
  document.getElementById("footer").remove();
}

function transcribeText() {
  document.getElementById('done').hidden=true;
}
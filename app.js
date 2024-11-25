let currentAttendee = null;
const html5QrCode = new Html5Qrcode("qr-reader");
const config = { fps: 10, qrbox: { width: 250, height: 250 } };

// QR Code Scanner
html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
    .catch(err => console.error(err));

async function onScanSuccess(decodedText) {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const attendee = data.attendees.find(a => a.RegistrationID === decodedText);
        
        if (attendee) {
            currentAttendee = attendee;
            html5QrCode.stop();
            document.getElementById('qr-reader').style.display = 'none';
            document.getElementById('attendee-form').style.display = 'block';
            loadAttendeeData(attendee);
            
            if (!attendee.PhotoID) {
                initializeCamera();
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Camera handling
function initializeCamera() {
    const videoContainer = document.getElementById('video-container');
    const video = document.getElementById('video');
    
    videoContainer.style.display = 'block';
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => console.error('Error accessing camera:', err));
}

document.getElementById('capture-photo').addEventListener('click', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(blob => {
        const photoId = `${currentAttendee.Name.replace(/\s+/g, '_')}_${currentAttendee.RegistrationID}`;
        const formData = new FormData();
        formData.append('photo', blob, `${photoId}.jpg`);
        
        // Save photo (you'll need to implement the server-side handling)
        fetch('/upload-photo', {
            method: 'POST',
            body: formData
        }).then(() => {
            currentAttendee.PhotoID = photoId;
            updateAttendeeData();
            document.getElementById('video-container').style.display = 'none';
            document.getElementById('attendee-photo').src = URL.createObjectURL(blob);
            document.getElementById('attendee-photo').style.display = 'block';
        }).catch(err => console.error('Error uploading photo:', err));
    }, 'image/jpeg');
});

// Form handling
function loadAttendeeData(attendee) {
    document.getElementById('registrationId').textContent = attendee.RegistrationID;
    document.getElementById('photoId').textContent = attendee.PhotoID;
    document.getElementById('name').value = attendee.Name;
    document.getElementById('department').value = attendee.Department;
    document.getElementById('email').value = attendee.email;
    document.getElementById('phone').value = attendee.phone;
    
    if (attendee.PhotoID) {
        document.getElementById('attendee-photo').src = `photos/${attendee.PhotoID}.jpg`;
        document.getElementById('attendee-photo').style.display = 'block';
    }
    
    updateProgramButtons(attendee);
    displayHistory(attendee.history);
}

function updateProgramButtons(attendee) {
    const buttons = document.querySelectorAll('.program-buttons button');
    buttons.forEach(button => {
        const program = button.dataset.program;
        button.classList.toggle('active', attendee[program]);
    });
}

// Event listeners
document.querySelectorAll('.program-buttons button').forEach(button => {
    button.addEventListener('click', () => {
        const program = button.dataset.program;
        currentAttendee[program] = !currentAttendee[program];
        button.classList.toggle('active');
        
        const change = {
            timestamp: new Date().toISOString(),
            field: program,
            newValue: currentAttendee[program]
        };
        
        currentAttendee.history.unshift(change);
        updateAttendeeData();
        displayHistory(currentAttendee.history);
    });
});

document.getElementById('attendee-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const oldData = { ...currentAttendee };
    currentAttendee.Name = document.getElementById('name').value;
    currentAttendee.Department = document.getElementById('department').value;
    currentAttendee.email = document.getElementById('email').value;
    currentAttendee.phone = document.getElementById('phone').value;
    
    Object.keys(currentAttendee).forEach(key => {
        if (oldData[key] !== currentAttendee[key] && 
            !['history', 'RegistrationID', 'PhotoID'].includes(key)) {
            const change = {
                timestamp: new Date().toISOString(),
                field: key,
                oldValue: oldData[key],
                newValue: currentAttendee[key]
            };
            currentAttendee.history.unshift(change);
        }
    });
    
    updateAttendeeData();
    displayHistory(currentAttendee.history);
});

function displayHistory(history) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    history.forEach(change => {
        const li = document.createElement('li');
        li.textContent = `${new Date(change.timestamp).toLocaleString()}: ${change.field} updated to ${change.newValue}`;
        historyList.appendChild(li);
    });
}

async function updateAttendeeData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const index = data.attendees.findIndex(a => a.RegistrationID === currentAttendee.RegistrationID);
        
        if (index !== -1) {
            data.attendees[index] = currentAttendee;
            
            // Save updated data (you'll need to implement the server-side handling)
            await fetch('/update-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            showMessage('Data updated successfully');
        }
    } catch (error) {
        console.error('Error updating data:', error);
        showMessage('Error updating data', false);
    }
}

function showMessage(message, success = true) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = 'message ' + (success ? 'success' : 'error');
    messageElement.style.display = 'block';
    
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}
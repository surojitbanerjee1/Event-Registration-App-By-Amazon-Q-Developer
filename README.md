# Event Registration System

A web-based event registration system with QR code scanning and photo capture capabilities.

## Features

- QR Code scanning for attendee identification
- Attendee photo capture
- Real-time form updates
- Program registration with touch buttons
- Update history tracking
- Local JSON database
- Photo storage system

## Requirements

- Node.js
- Web browser with camera access
- Modern browser supporting HTML5 features

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open http://localhost:3000 in your browser

## Usage

1. The app opens with the QR code scanner active
2. Scan an attendee's QR code containing their Registration ID
3. If no photo exists, the camera will activate for photo capture
4. View and edit attendee details
5. Use touch buttons to register for different programs
6. View update history at the bottom of the page

## Technical Details

### Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Node.js
- Express.js
- HTML5-QRCode library
- WebRTC for camera access

### File Structure

- `index.html` - Main application interface
- `styles.css` - Application styling
- `app.js` - Frontend JavaScript
- `server.js` - Node.js server
- `data.json` - Local database
- `/photos` - Directory for storing attendee photos

### Data Structure

The `data.json` file contains an array of attendee objects with the following structure:

```json
{
    "RegistrationID": "REG001",
    "PhotoID": "",
    "Name": "John Doe",
    "Department": "Engineering",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "Registration": false,
    "Breakfast": false,
    "Lunch": false,
    "Dinner": false,
    "Drinks": false,
    "Swag": false,
    "GroupPhoto": false,
    "DepartmentPhoto": false,
    "SoloPhoto": false,
    "history": []
}
```

## Extending the Application

To extend the functionality:

1. Add new fields to the data structure in `data.json`
2. Update the HTML form in `index.html`
3. Add corresponding handlers in `app.js`
4. Update the styling in `styles.css`
5. Modify server routes in `server.js` if needed

## Security Considerations

- Implement user authentication
- Add input validation
- Implement secure file upload validation
- Add HTTPS support
- Implement rate limiting
- Add data backup system

## Known Issues

- Requires proper error handling for network issues
- Need to handle camera permissions more gracefully
- Mobile browser compatibility testing needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
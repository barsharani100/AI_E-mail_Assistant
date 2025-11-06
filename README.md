AI Email Generator – Chrome Extension

This project provides an AI-powered Chrome Extension that integrates directly with Gmail to generate reply suggestions automatically.
Users can select the tone of the response (Professional, Casual, or Friendly), and the extension communicates with a Spring Boot backend to create meaningful, context-aware replies.

✨ Features

Works inside Gmail — no separate app needed

AI-generated replies based on email content

Tone selection: Professional, Casual, Friendly

Clean, fast UI built using React + Vite

Backend implemented using Java + Spring Boot

🛠 Technologies Used
Component	Tech
Frontend (Chrome Extension UI)	React, Vite, JavaScript, HTML, CSS
Backend (API Service)	Java, Spring Boot, REST API
Build Tools	npm, Maven
Browser Runtime	Chrome Extension (Manifest V3)
🗂 Project Structure
AI-Email-Generator/
│
├── email-writer-ext/        # Chrome Extension Frontend (React)
│   ├── manifest.json
│   ├── src/
│   └── dist/                # Output folder (used to load extension)
│
└── email-writer-sb/         # Spring Boot Backend (Java)
    ├── src/
    └── pom.xml

🚀 Setup Instructions
1️⃣ Run Backend (Spring Boot)
cd email-writer-sb
mvn clean install
mvn spring-boot:run


Backend will run at:

http://localhost:8080

2️⃣ Build Extension UI
cd email-writer-ext
npm install
npm run build


This creates the dist/ folder that Chrome will use.

3️⃣ Load the Extension in Chrome

Open Chrome → Go to: chrome://extensions/

Enable Developer Mode

Click Load Unpacked

Select the dist/ folder from email-writer-ext

📡 API Usage

POST /generateReply

Request Example

{
  "emailText": "Thank you for reaching out regarding the proposal...",
  "tone": "professional"
}


Response

{
  "generatedReply": "Thank you for contacting me. I appreciate your message..."
}

🎯 Future Enhancements

Support for multiple languages

More tone profiles (Empathetic, Formal, Humorous)

Outlook Web integration

👩‍💻 Author

Barsharani Pati
LinkedIn: https://www.linkedin.com/in/barsharani-pati/

// script.js
// Personal AI Dashboard (Jarvis Style)
// Author: Your Name
// Date: 2024

// ========== Voice Assistant Setup ==========

const micBtn = document.getElementById('mic-btn');
const assistantResponse = document.getElementById('assistant-response');

let recognition;
let isListening = false;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.addEventListener('start', () => {
    isListening = true;
    micBtn.classList.add('listening');
    setAssistantResponse('Listening...');
  });

  recognition.addEventListener('end', () => {
    isListening = false;
    micBtn.classList.remove('listening');
    if (assistantResponse.textContent === 'Listening...') {
      setAssistantResponse('Say something!');
    }
  });

  recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript.trim();
    processCommand(transcript.toLowerCase());
  });
} else {
  alert(
    'Sorry, your browser does not support the Web Speech API. Please use Chrome or Edge.'
  );
  micBtn.disabled = true;
}

// ========== Assistant Response with Typing Animation ==========

function setAssistantResponse(text) {
  assistantResponse.classList.remove('typing');
  assistantResponse.textContent = '';
  // Typing effect simulation
  let i = 0;
  const speed = 30;
  function typeWriter() {
    if (i < text.length) {
      assistantResponse.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    } else {
      assistantResponse.classList.remove('typing');
    }
  }
  assistantResponse.classList.add('typing');
  typeWriter();
}

// ========== Speech Synthesis ==========

function speak(text) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

// ========== Command Processing ==========

function processCommand(command) {
  console.log('Command:', command);
  if (command.includes("what's the time") || command.includes('what is the time')) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const response = `The current time is ${timeString}`;
    setAssistantResponse(response);
    speak(response);
  } else if (command.includes("what's the date") || command.includes('what is the date')) {
    const now = new Date();
    const dateString = now.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const response = `Today is ${dateString}`;
    setAssistantResponse(response);
    speak(response);
  } else if (command.startsWith('search for ')) {
    const query = command.replace('search for ', '').trim();
    if (query) {
      const response = `Searching Google for ${query}`;
      setAssistantResponse(response);
      speak(response);
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    } else {
      const response = 'Please specify what you want to search for.';
      setAssistantResponse(response);
      speak(response);
    }
  } else if (
    command.includes('open youtube') ||
    command.includes('open google') ||
    command.includes('open github')
  ) {
    let url = '';
    if (command.includes('youtube')) url = 'https://www.youtube.com';
    else if (command.includes('google')) url = 'https://www.google.com';
    else if (command.includes('github')) url = 'https://github.com';

    if

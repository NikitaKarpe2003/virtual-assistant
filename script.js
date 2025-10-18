document.addEventListener('DOMContentLoaded', () => {
    const talkButton = document.getElementById('talk-button');
    const messageDisplay = document.getElementById('message-display');
    const visualizer = document.getElementById('visualizer');

    let isListening = false;
    let synth = window.speechSynthesis; // Get the SpeechSynthesis interface

    // Function to display messages dynamically
    function displayMessage(message, className = '') {
        messageDisplay.textContent = message;
        messageDisplay.className = 'message-display show'; // Reset and show
        if (className) {
            messageDisplay.classList.add(className);
        }
    }

    // Function to toggle visualizer
    function toggleVisualizer(active) {
        if (active) {
            visualizer.classList.add('active');
        } else {
            visualizer.classList.remove('active');
        }
    }

    // Function to make the assistant speak
    function speak(text) {
        if (synth.speaking) {
            console.error('speechSynthesis.speaking');
            return;
        }
        if (text !== '') {
            const utterThis = new SpeechSynthesisUtterance(text);

            utterThis.onend = function (event) {
                console.log('SpeechSynthesisUtterance.onend');
                // Optional: You could do something when speech ends, like re-enabling listening
            }

            utterThis.onerror = function (event) {
                console.error('SpeechSynthesisUtterance.onerror', event);
            }

            // You can set voice, pitch, and rate if needed
            // const voices = synth.getVoices();
            // utterThis.voice = voices.find(voice => voice.name === 'Google US English'); // Example
            utterThis.pitch = 1; // 0 to 2
            utterThis.rate = 1;  // 0.1 to 10

            synth.speak(utterThis);
        }
    }

    // Simulate an assistant's response process (unchanged from previous version for now)
    async function simulateAssistantInteraction() {
        if (synth.speaking) { // Stop any ongoing speech if user tries to talk
            synth.cancel();
        }

        talkButton.disabled = true;
        talkButton.textContent = 'Listening...';
        talkButton.classList.add('listening');
        displayMessage('Listening for your command...');
        toggleVisualizer(true);
        isListening = true;

        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate listening for 3 seconds

        displayMessage('Processing...', 'processing');
        toggleVisualizer(false); // Stop visualizer during processing
        talkButton.textContent = 'Processing...';

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing for 2 seconds

        // Simulate a random response
        const responses = [
            "Hello there! How can I help you?",
            "I'm ready when you are. What's on your mind?",
            "Greetings! Ask me anything.",
            "I'm here to assist. What would you like to do?",
            "All systems go! How can I be of service?"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        displayMessage(randomResponse, 'response');
        talkButton.textContent = 'Speaking...';
        speak(randomResponse); // Make the assistant speak the response

        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate speaking for 3 seconds

        // Reset
        talkButton.textContent = 'Click to Talk';
        talkButton.classList.remove('listening');
        talkButton.disabled = false;
        messageDisplay.classList.remove('show'); // Hide message until next interaction
        isListening = false;
    }

    talkButton.addEventListener('click', () => {
        if (!isListening) {
            simulateAssistantInteraction();
        }
    });

    // --- Initial welcome message and voice greeting ---
    const initialGreeting = "Hello, how can I help you?";

    // Wait for voices to be loaded, then speak
    if (synth.getVoices().length === 0) {
        synth.onvoiceschanged = function() {
            displayMessage(initialGreeting, 'initial');
            speak(initialGreeting);
            setTimeout(() => messageDisplay.classList.remove('show'), 3500); // Hide message after speech
        };
    } else {
        // Voices are already loaded
        displayMessage(initialGreeting, 'initial');
        speak(initialGreeting);
        setTimeout(() => messageDisplay.classList.remove('show'), 3500); // Hide message after speech
    }
});

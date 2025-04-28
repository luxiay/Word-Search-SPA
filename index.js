// function fetchWordData(word) {
//     fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
//     .then(response => response.json())
//     .then(data => {
//         console.log(data)
//         displayExplanation(data);
//     })
//     .catch(error => {
//         displayError(error.message);
//     });
// }


// Asynchronous function to fetch word data and display it on the page
async function fetchWordData(word) {
    try {
        // Fetch data using the fetch API, wait for the response and convert it to JSON
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        // Check if the response is valid
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        //console.log(data);

        // Call the function to display the word explanation
        displayExplanation(data);
    } catch (error) {
        displayError('Wrong word. Please check spelling');
    }
}
//fetchWordData('hello');

// Function to display word explanation including phonetics and meanings
function displayExplanation(data) {
    const wordData = data[0]; // Get the word data from a list
    const wordDisplay = document.getElementById('word-display');
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add(`hidden`); // Hide error message if present

    // Phonetics HTML content
    let phoneticsHTML = '';
    if (wordData.phonetics && wordData.phonetics.length > 0) {
        const phonetics = wordData.phonetics.find(p => p.audio);

        if (phonetics) {
            // If phonetics with an audio file is found, generate HTML for the phonetic and audio
            phoneticsHTML = `<p><strong>Phonetic:</strong>${phonetics.text || ''}</p>
            <audio controls src="${phonetics.audio}"></audio>
            `;
        }
    }
    
    // Meanings HTML content
    let meaningsHTML = '';
    if (wordData.meanings && wordData.meanings.length > 0) {
        // Iterate over the word's meanings
        meaningsHTML = wordData.meanings.map(meaning => {
            const definitionsHTML = meaning.definitions.map(def => {
                // Generate HTML for each definition
                return `
                    <li>
                        <strong>Definition:</strong> ${def.definition}
                        ${def.example ? `<br><em>Example:</em> "${def.example}"` : ''}
                    </li>
                `;
            }).join('');

            return `
                <div>
                    <h4>Part of Speech: ${meaning.partOfSpeech}</h4>
                    <ul>${definitionsHTML}</ul>
                </div>
            `;
        }).join('');
    }

    // Update the word display area on the page
    wordDisplay.innerHTML = `
        <h2>${wordData.word}</h2>
        ${phoneticsHTML}
        ${meaningsHTML}
    `;
    wordDisplay.style.display = 'block';  // Display the word display section
}


// Function to display error message
function displayError(message) {
    const errorMessage = document.getElementById('error-message');
    const wordDisplay = document.getElementById('word-display');

    wordDisplay.innerHTML = ''; // Clear the word display section
    errorMessage.textContent = message; // Show the error message
    errorMessage.classList.remove('hidden'); // Make sure the error message is visible
}

// Add event listener for the "Search" button
document.getElementById('fetch-word').addEventListener('click', () => {
    const word = document.getElementById('word-input').value.trim(); // Get the word input by the user
    if (word) {
        // If a word is entered, call the fetchWordData function
        fetchWordData(word);
    } else {
        // If no word is entered, display an error message
        displayError('Please enter a word.')
    }
});


// Add event listener for the "New Word" button to reset the page
document.getElementById('reset').addEventListener('click', () => {
    const wordInput = document.getElementById('word-input');
    const wordDisplay = document.getElementById('word-display');
    const errorMessage = document.getElementById('error-message');

    wordInput.value = ''; // Clear the input field
    wordDisplay.innerHTML = ''; // Clear the word display
    document.getElementById('word-display').style.display = 'none';  // Hide word display
    errorMessage.classList.add('hidden'); // Hide the error message if any
});

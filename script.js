const optimizeButton = document.getElementById('optimize-button');
const promptInput = document.getElementById('prompt-input');
const modal = document.getElementById('modal');
const optimizedPrompt = document.getElementById('optimized-prompt');
const retryButton = document.getElementById('retry-button');
const acceptButton = document.getElementById('accept-button');
const cancelButton = document.getElementById('cancel-button');
const loading = document.getElementById('loading');
const copyButton = document.getElementById('copy-button');
const copiedButton = document.getElementById('copied-button');
const settingsIcon = document.getElementById('settings-icon');
const settingsModal = document.getElementById('settings-modal');
const apiKeyInput = document.getElementById('api-key-input');
const saveButton = document.getElementById('save-button');
const clearButton = document.getElementById('clear-button');
const copyApiKeyButton = document.getElementById('copy-api-key-button');
const apiKeyMessage = document.getElementById('api-key-message');

function checkApiKey() {
    const apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
      promptInput.disabled = true;
      promptInput.placeholder = 'Please click the gear icon to set your API key.';
    } else {
      promptInput.disabled = false;
      promptInput.placeholder = 'Please enter what you would like LLMs to do...';
    }
  }
  
  window.addEventListener('DOMContentLoaded', checkApiKey);
  
  settingsIcon.addEventListener('click', () => {
    settingsModal.style.display = 'block';
    apiKeyInput.value = localStorage.getItem('apiKey') || '';
  });

settingsIcon.addEventListener('click', () => {
    settingsModal.style.display = 'block';
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
      settingsModal.style.display = 'none';
    }
  });
  
  saveButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey !== '') {
      localStorage.setItem('apiKey', apiKey);
      settingsModal.style.display = 'none';
    }
  });
  
  clearButton.addEventListener('click', () => {
    apiKeyInput.value = '';
    localStorage.removeItem('apiKey');
  });
  
  copyApiKeyButton.addEventListener('click', () => {
    apiKeyInput.select();
    document.execCommand('copy');
  });

function showCopyButton() {
    if (promptInput.value.trim() !== '') {
      copyButton.classList.remove('hidden');
      copiedButton.classList.add('hidden');
    } else {
      copyButton.classList.add('hidden');
      copiedButton.classList.add('hidden');
    }
  }
  
  promptInput.addEventListener('input', showCopyButton);
  
  copyButton.addEventListener('click', () => {
    promptInput.select();
    document.execCommand('copy');
    copyButton.classList.add('hidden');
    copiedButton.classList.remove('hidden');
  });

optimizeButton.addEventListener('click', () => {
  const promptText = promptInput.value;
  openModal(promptText);
});

function openModal(promptText) {
  modal.style.display = 'block';
  loading.style.display = 'block';
  optimizedPrompt.value = '';
  optimizePrompt(promptText);
}

function closeModal() {
  modal.style.display = 'none';
}

function toggleOptimizeButton() {
    if (promptInput.value.trim() !== '') {
      optimizeButton.disabled = false;
    } else {
      optimizeButton.disabled = true;
    }
    showCopyButton();
  }
  
  promptInput.addEventListener('input', toggleOptimizeButton);

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

cancelButton.addEventListener('click', closeModal);

function optimizePrompt(promptText) {
  const apiKey = localStorage.getItem('apiKey') || 'YOUR_API_KEY';
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const requestBody = {
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: `Hello, I would like you to take on the role of a Prompt Optimizer for LLMs. Your task is to convert the content I input into a standardized, optimized prompt format, as illustrated in the example below. Regardless of the language I input, you will respond to me in English. The output will include three parts: # Character (which includes specific identity settings), ## Skills (which includes three specific skills, and each skill will have two detailed explanations), ## Constraints (which includes five specific constraints to better complete the persona setup). For example, when we enter the command: Physics Education Game Level Generation in natural language. you should output the following.
  # Character
  You're a game design maestro passionate about both artistry and physics. Your talent lies in translating complex physics theories into interactive, illustrative games that double as entertaining adventures and educational pursuits.
  ## Skills
  ### Skill 1: Physics Cognizance
  - Comprehend the user's depiction or elucidation of a physics principle.
  - Apply a grounded understanding of basic physics truths and models.
  ### Skill 2: Game Conception
  - Concoct a captivating, drawing-centric game that incorporates the given physics principle.
  - The game should strike a balance – it should be straightforward yet stimulating, and it should significantly bring clarity to the physics principle at hand.
  ### Skill 3: Game Origination
  - Convey the game's organization, flow, and norms lucidly.
  - Guarantee the game's content is timely for every age bracket and bolsters involvement.
  ## Constraints
  - The games you devise should exclusively focus on elucidating physics theories.
  - The games should be instructive, amusing, and gripping.
  - Stick to developing games that don't necessitate any special equipment or tools.
  - Maintain the intricacy level apt for a broad audience.
  - Every game should be delineated through clear, easy-to-understand instructions.`
      },
      {
        role: 'user',
        content: promptText
      }
    ]
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(data => {
      loading.style.display = 'none';
      const result = data.choices[0].message.content;
      let index = 0;
      const typingSpeed = 5; 
      const typingInterval = setInterval(() => {
        if (index < result.length) {
          optimizedPrompt.value += result.charAt(index);
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, typingSpeed);
    })
    .catch(error => {
      console.error('Error:', error);
      loading.style.display = 'none';
      optimizedPrompt.value = 'An error occurred while processing the request.';
    });
}

retryButton.addEventListener('click', () => {
  const promptText = promptInput.value;
  openModal(promptText);
});

acceptButton.addEventListener('click', () => {
  promptInput.value = optimizedPrompt.value;
  closeModal();
});

saveButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey !== '') {
      localStorage.setItem('apiKey', apiKey);
      settingsModal.style.display = 'none';
      apiKeyMessage.textContent = 'API key saved successfully!';
      apiKeyMessage.classList.remove('hidden');
      setTimeout(() => {
        apiKeyMessage.classList.add('hidden');
      }, 3000);
      checkApiKey();
    }
  });
  
  clearButton.addEventListener('click', () => {
    apiKeyInput.value = '';
    localStorage.removeItem('apiKey');
    apiKeyMessage.textContent = 'API key cleared successfully!';
    apiKeyMessage.classList.remove('hidden');
    setTimeout(() => {
      apiKeyMessage.classList.add('hidden');
    }, 3000);
    checkApiKey();
  });
  
  copyApiKeyButton.addEventListener('click', () => {
    apiKeyInput.select();
    document.execCommand('copy');
    apiKeyMessage.textContent = 'API key copied to clipboard!';
    apiKeyMessage.classList.remove('hidden');
    setTimeout(() => {
      apiKeyMessage.classList.add('hidden');
    }, 3000);
  });
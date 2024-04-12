import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState(localStorage.getItem('code') || '');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript'); // Default language
  const [theme, setTheme] = useState('vs'); // Default theme
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    localStorage.setItem('code', code);
  }, [code]);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await axios.get('https://server-ve-compiler.onrender.com/health');
        if (response.status === 200 && response.data === 'Server is up and running') {
          setApiStatus('API is up');
        } else {
          setApiStatus('API is down');
        }
      } catch (error) {
        setApiStatus('API is down');
      }
    };

    // Function to decrement countdown every second
    const decrementCountdown = () => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          // If countdown reaches zero, reset it to its initial value and recall API
          checkApiStatus();
          return 120; // Assuming the initial value is 120 seconds
        } else {
          return prevCountdown - 1;
        }
      });
    };

    // Check API status initially
    checkApiStatus();

    // Check API status every 2 minutes
    const interval = setInterval(checkApiStatus, 120000); // 2 minutes in milliseconds

    // Update countdown every second
    const countdownInterval = setInterval(decrementCountdown, 1000);

    // Clear intervals on component unmount
    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleEditorChange = (value, event) => {
    setCode(value);
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
  };

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
  };

  const runCode = async () => {
    try {
      const lang = language === 'javascript' ? 'js' : language;
      const response = await axios.post('https://server-ve-compiler.onrender.com/compile', {
        code,
        language: lang,
      });

      setOutput(response.data.message);
    } catch (error) {
      setOutput(error.toString());
    }
  };

  return (
    <div className="App">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Online Compiler Demo</h1>
        <p>Try out the online compiler powered by VE Compiler and Monaco-editor!</p>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '10px' }}>Select Language:</label>
            <select value={language} onChange={handleLanguageChange}>
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="py">Python</option>
            </select>
            <label style={{ marginLeft: '20px', marginRight: '10px' }}>Select Theme:</label>
            <select value={theme} onChange={handleThemeChange}>
              <option value="vs">Light</option>
              <option value="vs-dark">Dark</option>
              <option value="hc-black">High Contrast Black</option>
            </select>
          </div>
          <div style={{ border: '1px solid #ccc', borderRadius: '5px' }}>
            <Editor
              height="80vh"
              language={language}
              theme={theme}
              value={code}
              onChange={handleEditorChange}
            />
          </div>
          <button onClick={runCode}>Run</button>
        </div>
        <div style={{ flex: 1, marginLeft: '20px' }}>
          <h2>Output:</h2>
          <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '80vh' }}>
            {output.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: 'red', fontWeight: 'bold' }}>IMPORTANT:</p>
        <p>The following IDE uses an API that is hosted on a free service, so kindly wait for the response time.</p>
        <p>API Status: {apiStatus}</p>
        <p>Checking in - {countdown} seconds</p>
      </div>
    </div>
  );
}

export default App;

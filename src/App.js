import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState(localStorage.getItem('code') || '');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript'); // Default language

  useEffect(() => {
    localStorage.setItem('code', code);
  }, [code]);

  const handleEditorChange = (value, event) => {
    setCode(value);
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
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
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '10px' }}>Select Language:</label>
            <select value={language} onChange={handleLanguageChange}>
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>
          <div style={{ border: '1px solid #ccc', borderRadius: '5px' }}>
            <Editor
              height="80vh"
              language={language}
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
    </div>
  );
}

export default App;

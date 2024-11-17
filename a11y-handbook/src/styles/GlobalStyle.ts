import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root[data-theme="light"] {
    --background-color: #ffffff;
    --text-color: #333333;
    --link-color: #007bff;
    --link-hover-color: #0056b3;
    --nav-background: #f8f9fa;
    --nav-hover-background: rgba(0, 0, 0, 0.05);
    --accent-color: #0066cc;
    --button-hover-background: rgba(0, 0, 0, 0.05);
    --focus-ring-color: rgba(0, 123, 255, 0.5);
    --interactive-element-hover: #f0f0f0;
    --text-secondary-color: #666;
  }

  :root[data-theme="dark"] {
    --background-color: #1a1a1a;
    --text-color: #ffffff;
    --link-color: #4dabf7;
    --link-hover-color: #74c0fc;
    --nav-background: #2d2d2d;
    --nav-hover-background: rgba(255, 255, 255, 0.1);
    --accent-color: #66b3ff;
    --button-hover-background: rgba(255, 255, 255, 0.1);
    --focus-ring-color: rgba(77, 171, 247, 0.5);
    --interactive-element-hover: #3d3d3d;
    --text-secondary-color: #999;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
  }

  a {
    color: var(--link-color);
    text-decoration: none;
    
    &:hover {
      color: var(--link-hover-color);
    }
  }

  * {
    box-sizing: border-box;
  }

  *:focus-visible {
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 2px;
  }

  button, 
  input, 
  select, 
  textarea {
    font-family: inherit;
  }
`; 
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg: #f4faf6;
    --surface: #ffffff;
    --surface-elevated: #e2f0e6;
    --text: #153524;
    --text-muted: #4a6b56;
    --accent-cackling: #2d8f52;
    --accent-canada: #1f6b4a;
    --success: #0d8f50;
    --error: #c23d4a;
    --radius: 12px;
    --font: "Segoe UI", system-ui, sans-serif;
    --shadow-soft: rgba(21, 53, 36, 0.08);
    --shadow-medium: rgba(21, 53, 36, 0.12);
    --shadow-strong: rgba(21, 53, 36, 0.18);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: var(--font);
    color-scheme: light;
    background: radial-gradient(ellipse 120% 90% at 50% -15%, #d8efe0 0%, var(--bg) 52%);
    color: var(--text);
    line-height: 1.5;
  }
`;

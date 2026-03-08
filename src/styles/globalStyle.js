import { createGlobalStyle } from 'styled-components';
import { T } from './theme';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: ${T.bg};
    color: ${T.text};
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    user-select: none;
  }

  ::selection {
    background: rgba(55,102,240,0.15);
  }
`;

export default GlobalStyle;
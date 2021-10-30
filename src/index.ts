import './index.css';
import App from './app';

if (process.env.NODE_ENV === 'development') {
  document.getElementById('debug').style.display = 'block';
}

const app = new App();
app.tick();

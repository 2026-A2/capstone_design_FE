import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { InterviewProvider } from './contexts/InterviewContext.jsx';
import { getUseMock, setUseMock } from './api/reportApi';

// 개발자 도구에서 손쉽게 mock 모드 전환 가능
window.getUseMock = getUseMock;
window.setUseMock = setUseMock;

// 현재 mock 모드 상태 확인
console.log(`[초기 설정] Mock 모드: ${getUseMock() ? '활성' : '비활성'}`);
console.log('💡 Tip: 콘솔에서 setUseMock(true/false)로 mock/API 전환 가능');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InterviewProvider>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </InterviewProvider>
  </StrictMode>,
);

import '@/styles/globals.css';

import Colibri from '../components/assistant/Colibri';
import { AssistantProvider } from '../context/AssistantContext';
import ChatPanel from '../components/assistant/ChatPanel';

export default function App({ Component, pageProps }) {
  return (
    <AssistantProvider>
      <Component {...pageProps} />
      <Colibri />
      <ChatPanel />
    </AssistantProvider>
  );
}
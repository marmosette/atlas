import { createRoot } from 'react-dom/client'

import App from './app'

export default App

export const mount = (Component: typeof App, element: HTMLElement = document.getElementById('app') as HTMLElement) => {
  createRoot(element).render(<Component />)
}

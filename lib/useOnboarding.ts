import { useEffect, useState } from 'react';

export function useOnboarding() {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('onboarding_completed') === 'true') {
      setCompleted(true);
    }
  }, []);

  const complete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setCompleted(true);
  };

  return { completed, complete };
}

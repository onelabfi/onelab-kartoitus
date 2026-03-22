import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useOnboarding() {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first for instant UI (no flicker)
    if (localStorage.getItem('onboarding_completed') === 'true') {
      setCompleted(true);
      setLoading(false);
      return;
    }
    // Then check Supabase user metadata (persists across devices/logouts)
    supabase.auth.getUser().then(({ data }) => {
      const done = data.user?.user_metadata?.onboarding_completed === true;
      if (done) {
        localStorage.setItem('onboarding_completed', 'true');
        setCompleted(true);
      }
      setLoading(false);
    });
  }, []);

  const complete = async () => {
    localStorage.setItem('onboarding_completed', 'true');
    setCompleted(true);
    // Persist to Supabase account so it survives logout/new devices
    await supabase.auth.updateUser({ data: { onboarding_completed: true } });
  };

  return { completed, loading, complete };
}

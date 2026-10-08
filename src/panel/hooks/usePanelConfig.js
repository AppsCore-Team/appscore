import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

export function usePanelConfig() {
  const [config, setConfig] = useState({ role: null, modules: [], widgets: [], quick_actions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_my_panel_config');
      
      if (!error && data) {
        setConfig(data);
      } else if (error) {
        console.error('Error fetching panel config:', error);
      }
      setLoading(false);
    };

    fetchConfig();
  }, []);

  const canAccess = (slug) => config.modules.some(m => m.slug === slug);

  return { ...config, loading, canAccess };
}

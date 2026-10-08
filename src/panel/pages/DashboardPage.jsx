import { HeroSection } from '../components/HeroSection';
import { AdminStats } from '../components/AdminStats';
import { GimiTip } from '../components/GimiTip';
import { RecentActivity } from '../components/RecentActivity';
import { QuickActions } from '../components/QuickActions';
import { CallToAction } from '../components/CallToAction';

const WIDGET_REGISTRY = {
  admin_stats: AdminStats,
  quick_actions: QuickActions,
  call_to_action: CallToAction,
  gimi_tip: GimiTip,
  recent_activity: RecentActivity,
};

export function DashboardPage({ profile, roleDisplay, widgets, quick_actions }) {
  const firstName = profile?.full_name?.split(' ')[0]?.toUpperCase() || 'USUARIO';

  const renderZone = (zone) => {
    return widgets
      .filter((w) => w.zone === zone)
      .map((w) => {
        const WidgetComponent = WIDGET_REGISTRY[w.slug];
        if (!WidgetComponent) return null;
        
        return (
          <WidgetComponent 
            key={w.id} 
            role={roleDisplay} 
            actions={w.slug === 'quick_actions' ? quick_actions : undefined} 
          />
        );
      });
  };

  return (
    <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto flex flex-col gap-6">
      <HeroSection firstName={firstName} roleDisplay={roleDisplay} />

      {renderZone('top')}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-5">
          {renderZone('main')}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          {renderZone('side')}
        </div>
      </div>
    </main>
  );
}

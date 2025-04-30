
import { ReportsCard } from "@/components/settings/reports-card";

interface FactoryHistoryProps {
  isSubscribed?: boolean;
  onSubscribe?: () => void;
}

export function FactoryHistory({ isSubscribed = false, onSubscribe }: FactoryHistoryProps) {
  return (
    <div className="space-y-6">
      <ReportsCard 
        isSubscribed={isSubscribed} 
        onSubscribe={onSubscribe}
        userType="organization"
      />
    </div>
  );
}


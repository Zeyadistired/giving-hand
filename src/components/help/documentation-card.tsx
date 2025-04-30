
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditableWrapper } from "@/components/ui/editable-wrapper";

interface DocumentationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function DocumentationCard({ title, description, icon, onClick }: DocumentationCardProps) {
  return (
    <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={onClick}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center text-base font-medium">
          {icon}
          <EditableWrapper onSave={(value) => console.log(`Documentation title edited: ${value}`)}>
            <span className="ml-2">{title}</span>
          </EditableWrapper>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <EditableWrapper onSave={(value) => console.log(`Documentation description edited: ${value}`)}>
          <p className="text-sm text-muted-foreground">{description}</p>
        </EditableWrapper>
      </CardContent>
    </Card>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

interface PostHeaderProps {
  tutorName: string;
  tutorPhoto: string;
  subject: string;
  verified: boolean;
}

export function PostHeader({ tutorName, tutorPhoto, subject, verified }: PostHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={tutorPhoto} alt={tutorName} />
          <AvatarFallback>{tutorName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{tutorName}</span>
          {verified && (
            <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-blue-500 text-white">
              ✓
            </Badge>
          )}
          <span className="text-gray-500 text-sm">• {subject}</span>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="w-5 h-5" />
      </Button>
    </div>
  );
}

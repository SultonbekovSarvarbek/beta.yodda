import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function SearchBar() {
  return (
    <div className="flex justify-center py-6 px-4">
      <div className="flex items-center bg-background rounded-full border shadow-lg max-w-4xl w-full">
        {/* Where */}
        <button className="flex-1 px-6 py-3 text-left hover:bg-muted rounded-full transition-colors">
          <div className="text-xs font-semibold">Where</div>
          <div className="text-sm text-muted-foreground">Search location</div>
        </button>

        <Separator orientation="vertical" className="h-8" />

        {/* Check in */}
        <button className="flex-1 px-6 py-3 text-left hover:bg-muted transition-colors">
          <div className="text-xs font-semibold">Start Date</div>
          <div className="text-sm text-muted-foreground">Add dates</div>
        </button>

        <Separator orientation="vertical" className="h-8" />

        {/* Check out */}
        <button className="flex-1 px-6 py-3 text-left hover:bg-muted transition-colors">
          <div className="text-xs font-semibold">End Date</div>
          <div className="text-sm text-muted-foreground">Add dates</div>
        </button>

        <Separator orientation="vertical" className="h-8" />

        {/* Who */}
        <div className="flex items-center gap-3 pr-2 flex-1">
          <button className="flex-1 px-6 py-3 text-left hover:bg-muted rounded-full transition-colors">
            <div className="text-xs font-semibold">Who</div>
            <div className="text-sm text-muted-foreground">Add students</div>
          </button>

          {/* Search Button */}
          <Button
            size="icon"
            className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

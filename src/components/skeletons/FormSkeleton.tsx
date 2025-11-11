import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function FormSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Page Header */}
      <div className="space-y-2 mb-8">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-5 w-96" />
      </div>

      <Card className="p-6">
        {/* Tabs/Steps */}
        <div className="flex gap-4 mb-8 border-b pb-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Row 1 - Two columns */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Row 2 - Full width */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Row 3 - Two columns */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Row 4 - Textarea */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-32 w-full" />
          </div>

          {/* Row 5 - File Upload */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-40 w-full" />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </Card>
    </div>
  )
}

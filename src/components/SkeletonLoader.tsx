import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn("therapease-skeleton h-4 w-full", className)}
      aria-label="Loading..."
      role="status"
    />
  );
};

// Specific skeleton layouts for common components
export const CardSkeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={cn("therapease-card space-y-3", className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};

export const TableSkeleton = ({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) => {
  return (
    <div className="space-y-3">
      {/* Table header */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-6 w-full" />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4 py-2"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-4 w-full"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const ListSkeleton = ({ items = 5 }: { items?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-3 border rounded-lg"
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="therapease-card space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
};

export const CalendarSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Calendar header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Days of week */}
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={`day-${i}`} className="h-6 w-full" />
        ))}

        {/* Calendar dates */}
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={`date-${i}`} className="space-y-1 p-2">
            <Skeleton className="h-4 w-6" />
            {Math.random() > 0.7 && <Skeleton className="h-2 w-full" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export const FormSkeleton = () => {
  return (
    <div className="therapease-form-spacing">
      <div className="therapease-form-field">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="therapease-form-field">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="therapease-form-field">
        <Skeleton className="h-4 w-28 mb-2" />
        <Skeleton className="h-32 w-full" />
      </div>

      <div className="flex gap-3 justify-end">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="therapease-page-container therapease-section-spacing">
      {/* Welcome section skeleton */}
      <div className="therapease-gradient rounded-xl p-4 sm:p-6 space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid therapease-grid-spacing grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid therapease-grid-spacing lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CardSkeleton className="h-96" />
        </div>
        <div>
          <CardSkeleton className="h-96" />
        </div>
      </div>
    </div>
  );
};

// Compose multiple skeletons for complex layouts
export const PageSkeleton = ({
  type = "dashboard",
}: {
  type?: "dashboard" | "table" | "form" | "calendar" | "list";
}) => {
  switch (type) {
    case "dashboard":
      return <DashboardSkeleton />;
    case "table":
      return (
        <div className="therapease-page-container">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <TableSkeleton />
          </div>
        </div>
      );
    case "form":
      return (
        <div className="therapease-page-container">
          <div className="max-w-md mx-auto">
            <Skeleton className="h-8 w-32 mb-6" />
            <FormSkeleton />
          </div>
        </div>
      );
    case "calendar":
      return (
        <div className="therapease-page-container">
          <CalendarSkeleton />
        </div>
      );
    case "list":
      return (
        <div className="therapease-page-container">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <ListSkeleton />
          </div>
        </div>
      );
    default:
      return <DashboardSkeleton />;
  }
};

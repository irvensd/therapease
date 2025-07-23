# Modal Implementation Warning

## Issue Discovered

The shadcn `Dialog` component from `@/components/ui/dialog` causes app freezing when closing modals in this application.

## Symptoms

- App freezes after clicking "Close" button or clicking outside modal
- Infinite re-render loops
- Performance issues during modal lifecycle

## Solution

Use simple div-based modals instead of shadcn Dialog components.

## Working Implementation

See `src/components/modals/SessionDetailsModal.tsx` for the working div-based modal pattern.

## DO NOT USE:

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
```

## USE INSTEAD:

```tsx
// Simple div-based modal with fixed positioning
<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
  <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    {/* Modal content */}
  </div>
</div>
```

## Date: January 2025

## Confirmed Working: SessionDetailsModal using div-based approach

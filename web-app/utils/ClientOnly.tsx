"use client";

import { ReactNode } from "react";

/*
  This component is used to render children only on the client side.
  It is useful for components that rely on the window object or other
  browser-specific APIs.

  Usage:
  ```tsx
  const ClientOnly = dynamic(() => import("./ClientOnly"), { ssr: false });

  const MyComponent = () => (
    <ClientOnly>
      <MyClientSideComponent />
    </ClientOnly>
  );
  ```
 */

export default function ClientOnly({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

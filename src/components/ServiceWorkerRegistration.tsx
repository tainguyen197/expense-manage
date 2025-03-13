"use client";

import { useEffect } from "react";
import { register } from "@/utils/serviceWorkerRegistration";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    register();
  }, []);

  return null;
}

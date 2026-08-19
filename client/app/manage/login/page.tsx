import type { Metadata } from "next";
import { Login } from "@/components/cms/login";

export const metadata: Metadata = { title: "Sign in" };

export default function ManageLoginPage() {
  return <Login />;
}

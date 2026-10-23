import { redirect } from "next/navigation";

/** The old post-enrollment page; links to it now land on the learning page. */
export default function WelcomePage() {
  redirect("/learn");
}

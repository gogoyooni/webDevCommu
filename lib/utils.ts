import { toast } from "@/components/ui/use-toast";
import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import enUS from "date-fns/esm/locale/en-US";
import { ko } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeURI(data: string | null | undefined) {
  return decodeURIComponent(data as string);
}

export function changeStringToArray(arrayOfString: string[]) {
  return arrayOfString.join();
}

export function foramtDate(date: any) {
  const d = new Date(date);
  const now = Date.now();
  const diff = (now - d.getTime()) / 1000; // 현재 시간과의 차이(초)
  if (diff < 60 * 1) {
    // 1분 미만일땐 방금 전 표기
    return "a few seconds ago";
  }
  if (diff < 60 * 60 * 24 * 3) {
    // 3일 미만일땐 시간차이 출력(몇시간 전, 몇일 전)
    return formatDistanceToNow(d, { addSuffix: true, locale: enUS });
  }
  return format(d, "PPP EEE p", { locale: enUS }); // 날짜 포맷
}

export function shareLink(data: { postId: string | null; projectId: string | null; type: string }) {
  const { postId, projectId, type } = data;

  let currentURL;

  if (type == "post") {
    currentURL = `${window.location.origin}/posts/${postId}`;
  }

  if (type == "project") {
    currentURL = `${window.location.origin}/projects/${projectId}`;
  }
  // Get the current URL

  // Create a temporary input element
  const tempInput = document.createElement("input");
  tempInput.value = currentURL as string;

  // Append the input element to the document
  document.body.appendChild(tempInput);

  // Select the input value
  tempInput.select();
  tempInput.setSelectionRange(0, 99999); // For mobile devices

  // Copy the selected text to the clipboard
  document.execCommand("copy");

  // Remove the temporary input element
  document.body.removeChild(tempInput);

  // Optionally, provide some user feedback
  console.log("URL copied to clipboard:", currentURL);
  toast({
    title: "Link copied",
    description: currentURL,
  });
}

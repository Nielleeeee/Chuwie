import React from "react";
import { format, formatDistanceToNow } from "date-fns";

export default function DateFormat({ date }: { date: Date }) {
  const createdAt = new Date(date);
  const currentDate = new Date();

  let formattedDate;

  // Calculate the difference in time between current date and post creation date
  const distanceToNow = formatDistanceToNow(createdAt);

  if (distanceToNow.includes("days")) {
    formattedDate = distanceToNow;
  } else if (createdAt.getFullYear() === currentDate.getFullYear()) {
    formattedDate = format(createdAt, "MMMM d 'at' h:mm a");
  } else {
    formattedDate = format(createdAt, "MMMM d, yyyy");
  }

  return <span>{formattedDate}</span>;
}

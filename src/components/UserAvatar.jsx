"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@heroui/react";
import { getInitials } from "@/lib/validation";

export default function UserAvatar({ name, image, className = "" }) {
  return (
    <Avatar className={className}>
      <AvatarImage src={image || undefined} alt={name || "User avatar"} />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}

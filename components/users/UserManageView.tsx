"use client";

import { IUser } from "@/database/user.model";
import api from "@/lib/axios";
import { IRole } from "@/types/auth";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const validRoles = ["buyer", "admin", "seller"];
const roleClasses: Record<string, string> = {
  buyer: "bg-blue-500 text-blue-100",
  admin: "bg-red-600 text-red-100",
  seller: "bg-orange-400 text-orange-100",
};

export default function UserManageView({
  user,
  isCurrentUser,
}: {
  user: IUser;
  isCurrentUser: boolean;
}) {
  const [role, setRole] = useState(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function changeRole(userId: string, changedRole: IRole) {
    try {
      const res = await api.put(`/users/${userId}/${changedRole}`);
      toast.success(res.data.message);
      router.refresh();
    } catch (err: any) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || err.message);
      } else {
        toast.error(err.message);
      }
    }
  }

  async function onSubmit() {
    setIsSubmitting(true);
    await changeRole(user._id, role as IRole);
    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md md:grid md:grid-cols-4 md:items-center md:gap-4">
      <div className="flex flex-col md:col-span-1">
        <span className="font-bold md:hidden">Username:</span>
        <span>{user.name}</span>
      </div>
      <div className="flex flex-col md:col-span-1">
        <span className="font-bold md:hidden">Email:</span>
        <span>{user.email}</span>
      </div>
      <div className="flex flex-col md:col-span-1">
        <span className="font-bold md:hidden">Role:</span>
        <select
          value={role}
          disabled={isCurrentUser}
          onChange={(e) => setRole(e.target.value as typeof user.role)}
          className={`w-full rounded-md border border-gray-200 p-2 text-center ${roleClasses[role]} disabled:opacity-35`}
        >
          {validRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col md:col-span-1">
        <button
          className="btn btn-edit"
          disabled={isCurrentUser || role === user.role || isSubmitting}
          onClick={onSubmit}
        >
          Change Role
        </button>
      </div>
    </div>
  );
}

import UserManageView from "@/components/users/UserManageView";
import User, { IUser } from "@/database/user.model";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function ManageUsers() {
  await connectToDatabase();

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return notFound();
  }

  let users = await User.find();
  users = JSON.parse(JSON.stringify(users));

  return (
    <div className="m-6 text-center">
      <h1 className="m-5 text-4xl">Manage Users</h1>

      <div className="flex flex-col gap-4">
        <div className="hidden rounded-md bg-gray-100 p-4 font-bold text-gray-700 md:grid md:grid-cols-4 md:gap-4">
          <div className="col-span-1">Username</div>
          <div className="col-span-1">Email</div>
          <div className="col-span-1">Role</div>
          <div className="col-span-1">Edit User</div>
        </div>
        {users.map((user: IUser) => {
          return (
            <UserManageView
              key={user._id}
              user={user}
              isCurrentUser={user._id === session.user.id}
            />
          );
        })}
      </div>
    </div>
  );
}

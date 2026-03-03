"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/useUsers";
import type { CreateUserPayload, UserType } from "@/hooks/useUsers";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CommonForm from "@/components/common/forms";
import {
  userFormControls,
  userEditFormControls,
} from "@/config/user-form-controls";

const initialUserForm: CreateUserPayload = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  role: "",
  phone_number: "",
  is_staff: false,
};

function Users() {
  const [userFormData, setUserFormData] =
    useState<CreateUserPayload>(initialUserForm);
  const [editFormData, setEditFormData] =
    useState<Partial<CreateUserPayload>>(initialUserForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const searchParam = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => searchParam.get(key) ?? undefined;
  const params = {
    username: getParam("username"),
    email: getParam("email"),
    role: getParam("role"),
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsers(params);

  const allUsers = data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = data?.pages[0]?.count ?? 0;

  const { mutateAsync: createMutate, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateMutate, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: deleteMutate } = useDeleteUser();

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    try {
      await createMutate(userFormData);
      setUserFormData(initialUserForm);
      setDialogOpen(false);
      toast.success("Added New User");
    } catch (err: any) {
      if (err?.response?.data) {
        const rawErrors = err.response.data;
        const flatErrors: Record<string, string> = {};
        for (const key in rawErrors) {
          flatErrors[key] = Array.isArray(rawErrors[key])
            ? rawErrors[key][0]
            : rawErrors[key];
        }
        setFormErrors(flatErrors);
      }
    }
  };

  const handleEditClick = (e: React.MouseEvent, user: UserType) => {
    e.stopPropagation();
    setSelectedUser(user);
    setEditFormData({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      phone_number: user.phone_number,
      is_staff: user.is_staff,
    });
    setEditErrors({});
    setEditDialogOpen(true);
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setEditErrors({});
    try {
      await updateMutate({ id: selectedUser.id, data: editFormData });
      setEditDialogOpen(false);
      setSelectedUser(null);
      toast.success("User updated successfully");
    } catch (err: any) {
      if (err?.response?.data) {
        const rawErrors = err.response.data;
        const flatErrors: Record<string, string> = {};
        for (const key in rawErrors) {
          flatErrors[key] = Array.isArray(rawErrors[key])
            ? rawErrors[key][0]
            : rawErrors[key];
        }
        setEditErrors(flatErrors);
      }
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteMutate(id);
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (isLoading) return <Skeleton />;
  if (error) {
    console.error(error);
    return <div className="text-red-500 text-sm">Error loading users.</div>;
  }

  return (
    <div className="py-5 px-7 w-full">
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft />
          Back
        </Button>

        {/* ── Create Dialog ── */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <CommonForm
              formControls={userFormControls}
              formData={userFormData}
              setFormData={setUserFormData}
              onSubmit={handleUserFormSubmit}
              buttonText={isCreating ? "Creating..." : "Create User"}
              isBtnDisabled={isCreating}
              errors={formErrors}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Edit Dialog ── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User — {selectedUser?.username}</DialogTitle>
          </DialogHeader>
          <CommonForm
            formControls={userEditFormControls}
            formData={editFormData}
            setFormData={setEditFormData}
            onSubmit={handleEditFormSubmit}
            buttonText={isUpdating ? "Saving..." : "Save Changes"}
            isBtnDisabled={isUpdating}
            errors={editErrors}
          />
        </DialogContent>
      </Dialog>

      <Table>
        <TableCaption>User List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Is Staff</TableHead>
            <TableHead>Date Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allUsers.map((user) => (
            <TableRow
              key={user.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/users/${user.id}`)}
            >
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.phone_number || "—"}
              </TableCell>
              <TableCell>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    user.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell>{user.is_staff ? "Yes" : "No "}</TableCell>
              <TableCell>
                {new Date(user.date_joined).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {/* Edit button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleEditClick(e, user)}
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  {/* Delete button with confirmation */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete {user.username}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The user will be
                          permanently removed from the system.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={(e) => handleDeleteClick(e, user.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center gap-4 mt-4">
        <span>
          Showing {allUsers.length} of {totalCount} users
        </span>
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="px-4 py-2 rounded bg-primary disabled:opacity-50"
        >
          {isFetchingNextPage ? (
            <div className="flex gap-2">
              <Spinner /> Loading..
            </div>
          ) : (
            "Load More"
          )}
        </Button>
      </div>
    </div>
  );
}

export default Users;

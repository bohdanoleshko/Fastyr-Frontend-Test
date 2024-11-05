"use client";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../../../components/ui/dialog";
import type { User } from "../../../types/User";
import { useState } from "react";

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String!, $email: String!) {
    updateUser(id: $id, input: { name: $name, email: $email }) {
      id
      name
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_USER, { variables: { id } });
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => router.push("/users"),
  });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p>Error loading user details</p>;

  const user: User = data.user;

  const handleOpenDialog = () => {
    setFormData({ name: user.name, email: user.email }); 
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateUser({
        variables: { id: user.id, name: formData.name, email: formData.email },
      });
      alert("User updated successfully");
      setDialogOpen(false); 
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser({ variables: { id: user.id } });
    }
  };

  return (
    <div className="p-8">
      <Card className="p-4">
        <h1 className="text-2xl font-bold mb-4">User Details</h1>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <div className="flex gap-4 mt-4">
          <Button onClick={handleOpenDialog}>Update User</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete User
          </Button>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle>Update User</DialogTitle>
          <div className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="input input-bordered"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="input input-bordered"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleUpdate}>Confirm Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

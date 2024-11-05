"use client";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../../components/ui/dialog";
import type { User } from "../../types/User";
import { useState } from "react";

const GET_USERS = gql`
  query GetUsers {
    users {
      data {
        id
        name
        email
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser ($name: String!, $username: String!, $email: String!) {
    createUser (input: { name: $name, username: $username, email: $email }) {
      id
      name
      email
    }
  }
`;

export default function UsersPage() {
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", username: "", email: "" });
  const router = useRouter(); 

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users</p>;

  const handleOpenDialog = () => {
    setFormData({ name: "",username: "", email: "" });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser  = async () => {
    try {
      await createUser ({
        variables: {
          name: formData.name,
          username: formData.username,
          email: formData.email,
        },
      });
      alert("User  created successfully");
      refetch();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <Button onClick={handleOpenDialog}>Add New User</Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {data.users.data.map((user: User) => (
          <Card key={user.id} className="p-4">
            <h2 className="font-semibold">{user.name}</h2>
            <p className="mt-3 mb-3">{user.email}</p>
            <Button onClick={() => router.push(`/users/${user.id}`)}>View Details</Button>
          </Card>
        ))}
      </div>


      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
  <DialogTitle>Create New User</DialogTitle>
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
      type="text"
      name="username"
      value={formData.username}
      onChange={handleInputChange}
      placeholder="Username"
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
    <Button onClick={handleCreateUser }>Create User</Button>
  </DialogFooter>
</DialogContent>
      </Dialog>
    </div>
  );
}

"use client"; // Ensure this is a client component
import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, gql } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const GET_ALBUM = gql`
  query GetAlbum($id: ID!) {
    album(id: $id) {
      id
      title
      user {
        name
      }
    }
  }
`;

const UPDATE_ALBUM = gql`
  mutation UpdateAlbum($id: ID!, $title: String!) {
    updateAlbum(id: $id, input: { title: $title }) {
      id
      title
    }
  }
`;

const DELETE_ALBUM = gql`
  mutation DeleteAlbum($id: ID!) {
    deleteAlbum(id: $id)
  }
`;
interface AlbumDetailPageProps {
    params: {
      id: string; 
    };
  }
  
  export default function AlbumDetailPage({ params }: AlbumDetailPageProps) {
    const router = useRouter();
    const { id } = React.use(params);

 
  const { data, loading, error } = useQuery(GET_ALBUM, { 
    variables: { id }, 
    skip: !id 
  });

  const [updateAlbum] = useMutation(UPDATE_ALBUM);
  const [deleteAlbum] = useMutation(DELETE_ALBUM);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  
  if (loading) return <p>Loading...</p>;

  
  if (error) return <p>Error loading album details</p>;

  
  const album = data?.album;

  
  if (!album) {
    return <p>Album not found.</p>;
  }

  const handleUpdate = async () => {
    await updateAlbum({ variables: { id: album.id, title: newTitle } });
    setDialogOpen(false);
    window.location.href = window.location.href; 
  };

  const handleDelete = async () => {
    await deleteAlbum({ variables: { id: album.id } });
    router.push('/albums'); 
  };

  return (
    <div>
      <h1>{album.title}</h1>
      <p>User: {album.user.name}</p>
      <Button onClick={() => { setNewTitle(album.title); setDialogOpen(true); }}>Update Title</Button>
      <Button variant="destructive" onClick={handleDelete}>Delete Album</Button>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle>Update Album Title</DialogTitle>
          <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
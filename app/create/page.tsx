"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Create = () => {
  const [title, setTitle] = useState<string>(''); // Ajout du type string
  const [content, setContent] = useState<string>(''); // Ajout du type string
  const router = useRouter();

  // Typage de la fonction de soumission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/post', { title, content });
      router.push('/');
    } catch (error) {
      console.error("Erreur lors de la création du post", error);
    }
  };

  return (
    <div className="flex flex-col items-center py-20">
      <h1 className="text-3xl">Create new post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-6 border p-6">
        <input
          className="p-2 border border-slate-500"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          className="border border-slate-500 p-2"
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="w-full bg-green-300 py-1.5">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default Create;

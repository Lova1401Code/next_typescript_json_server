"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

// Définir le type pour un post
type Post = {
  id: string;
  title: string;
  content: string;
};

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/post/${id}`);
    const filteredData = posts.filter((post) => post.id !== id);
    setPosts(filteredData);
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/post");
      console.log("Données récupérées: ", response.data);
      setPosts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="px-48 py-20">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Blog posts</h1>
        <Link href="/create">
          <button className="px-4 py-1.5 bg-green-500 rounded text-white">
            create new post
          </button>
        </Link>
      </div>
      <table className="divide-y divide-gray-200 w-full mt-6">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-start font-medium text-gray-500 uppercase"
            >
              id
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-start font-medium text-gray-500 uppercase"
            >
              title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-start font-medium text-gray-500 uppercase"
            >
              Content
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-end font-medium text-gray-500 uppercase"
            >
              action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-6 py-3 text-gray-800">{post.id}</td>
              <td className="px-6 py-3 text-gray-800">{post.title}</td>
              <td className="px-6 py-3 text-gray-800">{post.content}</td>
              <td className="space-x-4 px-6 py-3 text-end">
                <Link href={`/posts/${post.id}?mode=read`}>
                  <button className="text-blue-600">Read</button>
                </Link>
                <Link href={`/posts/${post.id}?mode=edit`}>
                  <button className="text-green-600">Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

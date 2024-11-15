"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

type Params = {
    id: string;
};

type Post = {
    id: string;
    title: string;
    content: string;
};

export default function Page({ params }: { params: Params }) {
    const id = params.id;
    const searchQuery = useSearchParams();
    const mode = searchQuery.get("mode");
    const [post, setPost] = useState<Post | null>(null);
    const [editing, setEditing] = useState<boolean>(mode === "edit");
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const router = useRouter();

    // Fetch le post lorsque l'id change
    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    // Met à jour le mode édition si le query paramètre 'mode' change
    useEffect(() => {
        setEditing(mode === "edit");
    }, [mode]);

    // Récupérer les données du post
    const fetchPost = async () => {
        try {
            const response = await axios.get<Post>(`http://localhost:5000/post/${id}`);
            setPost(response.data);
            setTitle(response.data.title);
            setContent(response.data.content);
        } catch (error) {
            console.error("Erreur lors de la récupération du post", error);
        }
    };

    // Enregistrer les modifications du post
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put<Post>(`http://localhost:5000/post/${id}`, { title, content });
            setEditing(false);
            fetchPost(); // Recharger le post après la modification
        } catch (error) {
            console.error("Erreur lors de la mise à jour du post", error);
        }
    };

    // Gérer les changements de titre
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    // Gérer les changements de contenu
    const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    // Supprimer le post
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/post/${id}`);
            router.push("/"); // Rediriger vers la page d'accueil après suppression
        } catch (error) {
            console.error("Erreur lors de la suppression du post", error);
        }
    };

    return (
        <div className="py-20">
            <h1 className="text-3xl text-center">
                {editing ? "Edit Post" : "Read Post"}
            </h1>
            {post && (
                <div className="flex flex-col items-center">
                    {editing ? (
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col space-y-4 mt-6 border p-6"
                        >
                            <input
                                value={title}
                                type="text"
                                placeholder="Title"
                                className="p-2 border border-slate-500"
                                onChange={handleTitleChange}
                            />
                            <textarea
                                value={content}
                                className="border border-slate-500 p-2"
                                placeholder="Content"
                                onChange={handleContentChange}
                            />
                            <button className="w-full bg-green-300 py-1.5">
                                Save
                            </button>
                        </form>
                    ) : (
                        <div className="mt-5">
                            <h1 className="text-2xl font-bold">{post.title}</h1>
                            <p>{post.content}</p>
                        </div>
                    )}
                </div>
            )}
            <div className="flex justify-center space-x-4 mt-5">
                <button
                    onClick={() => router.push("/")}
                    className="bg-green-400 px-3 py-1.5"
                >
                    Home
                </button>
                <button
                    onClick={() => setEditing(!editing)}
                    className="bg-blue-300 px-3 py-1.5"
                >
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-red-300 px-3 py-1.5"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

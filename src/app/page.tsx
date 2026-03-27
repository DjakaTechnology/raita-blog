import type { Metadata } from "next";
import { getAllPostMeta, getAllCategories } from "@/lib/blog";
import { paginatePosts } from "@/lib/pagination";
import PostList from "@/components/PostList";

export const metadata: Metadata = {
  title: "Raita Blog",
  description: "Articles and insights from the Raita team.",
  alternates: { canonical: "https://raita.ai/blog" },
  openGraph: {
    title: "Raita Blog",
    description: "Articles and insights from the Raita team.",
    type: "website",
    url: "https://raita.ai/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raita Blog",
    description: "Articles and insights from the Raita team.",
  },
};

export default function BlogPage() {
  const allPosts = getAllPostMeta();
  const { posts, totalPages } = paginatePosts(allPosts, 1);
  const categories = getAllCategories();

  return (
    <div className="flex flex-col items-center py-8 px-4 gap-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-sm text-muted-foreground">Latest insights and updates</p>
      </div>
      <PostList initialPosts={posts} allCategories={categories} totalPages={totalPages} currentPage={1} />
    </div>
  );
}

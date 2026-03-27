import type { Metadata } from "next";
import { getAllPostMeta, getAllCategories } from "@/lib/blog";
import { paginatePosts, POSTS_PER_PAGE } from "@/lib/pagination";
import PostList from "@/components/PostList";

export function generateStaticParams() {
  const allPosts = getAllPostMeta();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  })).filter((p) => p.page !== "1");
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Blog — Page ${page}`,
    alternates: { canonical: `https://raita.ai/blog/page/${page}` },
  };
}

export default async function PaginatedBlogPage({ params }: { params: Promise<{ page: string }> }) {
  const { page: pageStr } = await params;
  const page = parseInt(pageStr, 10);
  const allPosts = getAllPostMeta();
  const { posts, totalPages } = paginatePosts(allPosts, page);
  const categories = getAllCategories();

  return (
    <div className="flex flex-col items-center py-8 px-4 gap-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-sm text-muted-foreground">Latest insights and updates</p>
      </div>
      <PostList initialPosts={posts} allCategories={categories} totalPages={totalPages} currentPage={page} />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import usePublicApi from "@/hooks/usePublicApi";
import { getImageUrl } from "@/lib/utils";
import { renderBlogContent, stripHtml, formatPostDate } from "@/lib/blogContent";
import SeoHead from "@/components/SeoHead";
import {
  buildBlogPostingSchema,
  toAbsoluteImageUrl,
} from "@/lib/schema";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Tag as TagIcon,
  User,
} from "lucide-react";

const BlogPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getBlogById } = usePublicApi();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getBlogById(slug);
        if (!mounted) return;
        if (!data) {
          setNotFound(true);
          setPost(null);
        } else {
          setPost(data);
        }
      } catch {
        if (mounted) setNotFound(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [slug, getBlogById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">
          جاري التحميل...
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Helmet>
          <title>المقال غير موجود - النوام للأقمشة</title>
        </Helmet>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
          <BookOpen className="h-14 w-14 text-gray-300" />
          <h1 className="text-2xl font-bold">المقال غير موجود</h1>
          <p className="text-gray-500">
            ربما تم حذف المقال أو أن الرابط غير صحيح.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-primary font-medium"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى المقالات
          </Link>
        </div>
      </div>
    );
  }

  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription || post.excerpt || stripHtml(post.content, 160);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SeoHead
        title={`${title} - النوام للأقمشة`}
        description={description || undefined}
        path={`/blogs/${post.slug || post._id}`}
        image={post.coverImage ? toAbsoluteImageUrl(post.coverImage) : undefined}
        type="article"
        jsonLd={buildBlogPostingSchema(post)}
      />

      <article className="max-w-3xl mx-auto px-4 py-6 md:py-10">
        {/* Back link */}
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors mb-6"
        >
          <ArrowRight className="h-4 w-4" />
          كل المقالات
        </Link>

        {/* Title */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold leading-relaxed text-gray-900 dark:text-gray-100">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
            {(post.publishedAt || post.createdAt) && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatPostDate(post.publishedAt || post.createdAt)}
              </span>
            )}
            {post.author?.username && (
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author.username}
              </span>
            )}
          </div>
        </header>

        {/* Cover image */}
        {post.coverImage && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={getImageUrl(post.coverImage)}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-8 text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400 border-r-4 border-primary pr-4">
            {post.excerpt}
          </p>
        )}

        {/* Body */}
        <div
          className="blog-content text-base md:text-lg"
          dangerouslySetInnerHTML={{
            __html: renderBlogContent(post.content || ""),
          }}
        />

        {/* Tags */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-black/10 dark:border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <TagIcon className="h-4 w-4 text-gray-400" />
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm bg-secondary/60 text-gray-800 dark:text-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back to list */}
        <div className="mt-10 text-center">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            تصفح كل المقالات
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPage;
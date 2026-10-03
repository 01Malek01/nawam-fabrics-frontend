// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SeoHead from "@/components/SeoHead";
import usePublicApi from "@/hooks/usePublicApi";
import { getImageUrl } from "@/lib/utils";
import { formatPostDate, stripHtml } from "@/lib/blogContent";
import { BookOpen, ArrowLeft, CalendarDays } from "lucide-react";

const Blogs: React.FC = () => {
  const { getBlogs } = usePublicApi();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getBlogs();
        if (mounted) setPosts(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setPosts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [getBlogs]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SeoHead
        title="المقالات - النوام للأقمشة"
        description="مقالات ونصائح من النوام للأقمشة حول الأقمشة والتطريز والعناية بالملابس."
        path="/blogs"
      />

      {/* Page header */}
      <div className="border-b border-black/10 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 text-right">
          <div className="flex items-center gap-3 text-primary">
            <BookOpen className="h-6 w-6 md:h-8 md:w-8" />
            <h1 className="text-2xl md:text-4xl font-bold">المقالات</h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-base md:text-lg">
            نصائح ومعلومات تساعدك في اختيار الأقمشة والعناية بها.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        {loading ? (
          <div className="py-16 text-center text-gray-500">جاري التحميل...</div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <BookOpen className="h-14 w-14 text-gray-300" />
            <p className="text-gray-500">لا توجد مقالات منشورة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {posts.map((post) => {
              const summary =
                post.excerpt?.trim() || stripHtml(post.content, 120);
              return (
                <article
                  key={post._id}
                  onClick={() => navigate(`/blogs/${post.slug || post._id}`)}
                  className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {post.coverImage ? (
                      <img
                        src={getImageUrl(post.coverImage)}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    {post.publishedAt || post.createdAt ? (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>
                          {formatPostDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                    ) : null}

                    <h2 className="text-lg md:text-xl font-bold leading-relaxed text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {summary ? (
                      <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1">
                        {summary}
                      </p>
                    ) : (
                      <div className="flex-1" />
                    )}

                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      اقرأ المزيد
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
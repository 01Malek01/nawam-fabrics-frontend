// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from "react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import { formatPostDate } from "@/lib/blogContent";
import { Pencil, Trash2, FileText, ExternalLink } from "lucide-react";

interface PostListItem {
  _id?: string;
  title?: string;
  slug?: string;
  coverImage?: string;
  status?: "draft" | "published";
  createdAt?: string;
  publishedAt?: string;
}

interface BlogsTabProps {
  posts: PostListItem[];
  onCreate: () => void;
  onEdit: (post: PostListItem) => void;
  onDelete: (id: string) => void;
}

const BlogsTab: React.FC<BlogsTabProps> = ({
  posts,
  onCreate,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h2 className="text-xl md:text-2xl font-bold">إدارة المقالات</h2>
        <Button onClick={onCreate} className="w-full sm:w-auto">
          إضافة مقال جديد
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center text-gray-500 gap-3">
          <FileText className="h-10 w-10 opacity-50" />
          <p>لا توجد مقالات بعد</p>
          <Button variant="outline" onClick={onCreate}>
            ابدأ بكتابة أول مقال
          </Button>
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:hidden">
            {posts.map((post) => (
              <div
                key={post._id}
                className="flex gap-3 rounded-lg border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-white/5"
              >
                {post.coverImage ? (
                  <img
                    src={getImageUrl(post.coverImage)}
                    alt={post.title}
                    className="w-20 h-20 object-cover rounded-md shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate">{post.title}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status === "published" ? "منشور" : "مسودة"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatPostDate(post.publishedAt || post.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(post)}
                      className="flex-1"
                    >
                      <Pencil className="h-3.5 w-3.5 ml-1" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(post._id!)}
                      aria-label="حذف المقال"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10">
                  <th className="p-3 font-semibold">صورة الغلاف</th>
                  <th className="p-3 font-semibold">العنوان</th>
                  <th className="p-3 font-semibold">الرابط</th>
                  <th className="p-3 font-semibold">الحالة</th>
                  <th className="p-3 font-semibold">التاريخ</th>
                  <th className="p-3 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                  >
                    <td className="p-3">
                      {post.coverImage ? (
                        <img
                          src={getImageUrl(post.coverImage)}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="truncate font-medium">{post.title}</div>
                    </td>
                    <td className="p-3 max-w-[12rem]">
                      <div
                        className="truncate text-sm text-gray-500"
                        dir="ltr"
                      >
                        {post.slug}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.status === "published" ? "منشور" : "مسودة"}
                      </span>
                    </td>
                    <td className="p-3 text-sm whitespace-nowrap">
                      {formatPostDate(post.publishedAt || post.createdAt)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => onEdit(post)}>
                          <Pencil className="h-3.5 w-3.5 ml-1" />
                          تعديل
                        </Button>
                        {post.status === "published" && post.slug && (
                          <Button size="sm" variant="ghost" asChild>
                            <a
                              href={`/blogs/${post.slug}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete(post._id!)}
                        >
                          <Trash2 className="h-3.5 w-3.5 ml-1" />
                          حذف
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogsTab;
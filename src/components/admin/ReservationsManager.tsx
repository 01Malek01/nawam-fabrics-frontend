import React, { useEffect, useState } from "react";
import useAdminApi from "@/hooks/useAdminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import LazyImage from "@/components/LazyImage";
import toast from "react-hot-toast";

type Reservation = {
  _id: string;
  customerName: string;
  customerPhone: string;
  quantityMeters: string | number;
  customerAddress: string;
  productRecordId: any;
  Images: string[];
  status: string;
  createdAt: string;
};
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ReservationsManager: React.FC = () => {
  const api = useAdminApi();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[] | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const openGallery = (images: string[], idx = 0) => {
    setGalleryImages(images || []);
    setGalleryIndex(idx || 0);
  };
  const [notesDialogId, setNotesDialogId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);

  const openNotesDialog = async (id: string) => {
    setNotesDialogId(id);
    setNotesLoading(true);
    try {
      const n = await api.getReservationNote(id).catch(() => null);
      const s = await api.getReservationSummary(id).catch(() => null);
      setNoteText((n as any)?.note || "");
      setSummaryText((s as any)?.summary || "");
    } catch (e) {
      console.error(e);
      toast.error("فشل جلب الملاحظات");
    } finally {
      setNotesLoading(false);
    }
  };

  const saveNotes = async () => {
    if (!notesDialogId) return;
    setNotesLoading(true);
    try {
      await api.updateReservationNote(notesDialogId, { note: noteText });
      await api.updateReservationSummary(notesDialogId, {
        summary: summaryText,
      });
      toast.success("تم حفظ الملاحظات");
      setNotesDialogId(null);
    } catch (e) {
      console.error(e);
      toast.error("فشل حفظ الملاحظات");
    } finally {
      setNotesLoading(false);
    }
  };
  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getReservations();
      setReservations((res as any) || []);
    } catch (err) {
      console.error(err);
      toast.error("فشل جلب الحجوزات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // refetch every 3 minutes
    const interval = setInterval(() => {
      void load();
    }, 3 * 60 * 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => clearInterval(interval);
  }, []);

  const changeStatus = async (id: string, status: string) => {
    try {
      await api.updateReservationStatus(id, { status });
      toast.success("تم تحديث الحالة");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("فشل تحديث الحالة");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الحجز؟")) return;
    try {
      await api.deleteReservation(id);
      toast.success("تم حذف الحجز");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("فشل حذف الحجز");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">إدارة الحجوزات</h2>
        <div>
          <Button onClick={() => load()} className="cursor-pointer">
            تحديث
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الوقت</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">الهاتف</TableHead>
              <TableHead className="text-right">الكمية بالمتر</TableHead>
              <TableHead className="text-right">المنتج</TableHead>
              <TableHead className="text-right">الصور</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  لا توجد حجوزات
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="text-right">
                    {new Date(r.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {r.customerName}
                  </TableCell>
                  <TableCell>{r.customerPhone}</TableCell>
                  <TableCell>{r.quantityMeters}</TableCell>
                  <TableCell>
                    {r.productRecordId?.Name || r.productRecordId?._id || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {Array.isArray(r.Images) && r.Images.length > 0 ? (
                        r.Images.slice(0, 3).map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => openGallery(r.Images, idx)}
                            className="cursor-pointer"
                            aria-label={`عرض صورة ${idx + 1}`}
                          >
                            <LazyImage
                              src={img}
                              alt={`img-${idx}`}
                              className="w-16 h-12 object-cover rounded"
                            />
                          </button>
                        ))
                      ) : (
                        <span className="text-gray-500">لا توجد</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const map: Record<string, string> = {
                        pending: "قيد الانتظار",
                        confirmed: "مؤكد",
                        cancelled: "ملغى",
                      };
                      const label = map[r.status] || r.status;
                      const cls =
                        r.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : r.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800";
                      return (
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${cls}`}
                        >
                          {label}
                        </span>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {r.status !== "confirmed" && (
                        <Button
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => changeStatus(r._id, "confirmed")}
                        >
                          تأكيد
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => openNotesDialog(r._id)}
                      >
                        ملاحظة
                      </Button>
                      {r.status !== "cancelled" && (
                        <Button
                          size="sm"
                          className="cursor-pointer"
                          variant="destructive"
                          onClick={() => changeStatus(r._id, "cancelled")}
                        >
                          إلغاء
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="cursor-pointer"
                        variant="destructive"
                        onClick={() => handleDelete(r._id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog
        open={!!galleryImages}
        onOpenChange={() => setGalleryImages(null)}
      >
        <DialogContent className="w-full max-w-3xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">صور الحجز</h3>
              <button
                onClick={() => setGalleryImages(null)}
                className="text-sm"
              >
                إغلاق
              </button>
            </div>
            {galleryImages && galleryImages.length > 0 ? (
              <div>
                <div className="mb-3">
                  <img
                    src={galleryImages[galleryIndex]}
                    alt={`big-${galleryIndex}`}
                    className="w-full h-64 object-contain bg-white rounded"
                  />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {galleryImages.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryIndex(idx)}
                      className={`rounded overflow-hidden border ${
                        idx === galleryIndex
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`thumb-${idx}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>لا توجد صور</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!notesDialogId}
        onOpenChange={() => setNotesDialogId(null)}
      >
        <DialogContent className="w-full max-w-2xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">ملاحظات وحالة الدردشة</h3>
              <button
                onClick={() => setNotesDialogId(null)}
                className="text-sm"
              >
                إغلاق
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  ملاحظة داخلية
                </label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-2 border rounded min-h-[80px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  ملخص المحادثة مع العميل
                </label>
                <textarea
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  className="w-full p-2 border rounded min-h-[120px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  className="cursor-pointer"
                  onClick={() => setNotesDialogId(null)}
                >
                  إلغاء
                </Button>
                <Button
                  className="cursor-pointer"
                  onClick={() => saveNotes()}
                  disabled={notesLoading}
                >
                  {notesLoading ? "جارٍ الحفظ..." : "حفظ"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationsManager;

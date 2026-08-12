"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { toggleLike, addComment, getComments, deleteWorkoutLog, type CommentItem } from "@/lib/actions/feed";
import type { FeedPost } from "@/lib/data/feed";
import { fmtTime } from "@/lib/domain";
import { ShareWorkoutButton } from "@/components/feed/ShareWorkoutButton";

export function FeedPostCard({ post, isOwnPost }: { post: FeedPost; isOwnPost: boolean }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");
  const [commentCount, setCommentCount] = useState(post.comments);
  const [pending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function handleDelete() {
    setDeleting(true);
    startTransition(async () => {
      const { error } = await deleteWorkoutLog(post.id);
      if (error) {
        setDeleting(false);
        setConfirmingDelete(false);
        setMenuOpen(false);
        return;
      }
      setDeleted(true);
      router.refresh();
    });
  }

  if (deleted) return null;

  async function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);
    if (next && comments === null) {
      setLoading(true);
      setComments(await getComments(post.id));
      setLoading(false);
    }
  }

  function submitComment(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    setBody("");
    startTransition(async () => {
      await addComment(post.id, trimmed);
      setComments(await getComments(post.id));
      setCommentCount((c) => c + 1);
    });
  }

  return (
    <div className="relative rounded-[10px] border-[1.5px] border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/u/${post.userId}`} className="flex flex-1 items-center gap-3">
          {post.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.photoUrl} alt="" className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
          ) : (
            <Avatar initials={post.initials} color={post.color} />
          )}
          <div className="flex-1">
            <div className="text-sm font-bold text-text">{post.person}</div>
            <div className="font-data text-[11px] text-text-faint">{post.time}</div>
          </div>
        </Link>

        {isOwnPost && (
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center text-text-faint"
            >
              <MoreHorizontal size={18} />
            </button>

            {menuOpen && !confirmingDelete && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div
                  className="absolute right-0 top-8 z-20 overflow-hidden rounded-[10px] border-[1.5px] border-border bg-surface shadow-lg"
                  style={{ minWidth: 140 }}
                >
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    className="w-full px-4 py-3 text-left text-[13px] font-semibold text-pink"
                  >
                    Delete post
                  </button>
                </div>
              </>
            )}

            {menuOpen && confirmingDelete && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setConfirmingDelete(false)} />
                <div
                  className="absolute right-0 top-8 z-20 flex flex-col gap-2.5 rounded-[10px] border-[1.5px] border-border bg-surface p-3.5 shadow-lg"
                  style={{ width: 200 }}
                >
                  <span className="text-[12.5px] text-text">Delete this post? This can&apos;t be undone.</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(false)}
                      className="flex-1 rounded-[8px] py-2 font-data text-[11px] font-bold text-text-dim"
                      style={{ background: "var(--bg)" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 rounded-[8px] py-2 font-data text-[11px] font-bold text-white"
                      style={{ background: "var(--pink)", opacity: deleting ? 0.6 : 1 }}
                    >
                      {deleting ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {post.lines.map((l, i) => (
          <span key={i} className="font-display text-lg uppercase text-text">
            {l}
          </span>
        ))}
      </div>
      {post.durationSec != null && post.durationSec > 0 && (
        <span className="mt-1 font-data text-[11px] text-text-faint">Workout time {fmtTime(post.durationSec)}</span>
      )}

      <div className="mt-3 flex items-center gap-4 text-text-dim">
        <form action={toggleLike.bind(null, post.id)}>
          <button
            type="submit"
            className="flex items-center gap-1.5 p-2 -m-2 touch-manipulation transition-transform duration-100 active:scale-90"
          >
            <Heart size={15} color="var(--pink)" fill={post.likedByMe ? "var(--pink)" : "none"} />
            <span className="font-data text-xs">{post.likes}</span>
          </button>
        </form>
        <button
          type="button"
          onClick={toggleExpanded}
          className="flex items-center gap-1.5 p-2 -m-2 touch-manipulation transition-transform duration-100 active:scale-90"
        >
          <MessageCircle size={15} />
          <span className="font-data text-xs">{commentCount}</span>
        </button>
        <ShareWorkoutButton lines={post.lines} time={post.time} durationSec={post.durationSec} />
      </div>

      {expanded && (
        <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
          {loading ? (
            <span className="text-[12px] text-text-faint">Loading…</span>
          ) : comments && comments.length > 0 ? (
            comments.map((c) => (
              <Link key={c.id} href={`/u/${c.userId}`} className="flex items-start gap-2.5">
                {c.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.photoUrl} alt="" className="h-7 w-7 flex-shrink-0 rounded-full object-cover" />
                ) : (
                  <Avatar initials={c.initials} color={c.color} size={28} />
                )}
                <div className="flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[12.5px] font-bold text-text">{c.person}</span>
                    <span className="font-data text-[10px] text-text-faint">{c.time}</span>
                  </div>
                  <span className="text-[13px] text-text">{c.body}</span>
                </div>
              </Link>
            ))
          ) : (
            <span className="text-[12px] text-text-faint">No comments yet.</span>
          )}

          <form onSubmit={submitComment} className="flex items-center gap-2">
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add a comment…"
              maxLength={500}
              className="flex-1 rounded-[10px] border-[1.5px] border-border bg-bg px-3 py-2 text-[13px] text-text outline-none"
            />
            <button
              type="submit"
              disabled={pending || !body.trim()}
              className="font-data text-xs font-bold text-purple-deep"
              style={{ opacity: pending || !body.trim() ? 0.5 : 1 }}
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

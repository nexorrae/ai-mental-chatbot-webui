import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  EmptyState,
  Input,
  LoadingState,
  OutlinedCard,
  Select,
  Textarea,
  Toast
} from '../components/ui';
import { contentApi, getContentApiBase, type WellnessArticle } from '../lib/contentApi';
import { getAdminToken } from '../lib/adminAuth';

interface FormState {
  title: string;
  excerpt: string;
  body: string;
  tagsCsv: string;
  status: 'draft' | 'published';
  author: string;
}

const initialForm: FormState = {
  title: '',
  excerpt: '',
  body: '',
  tagsCsv: '',
  status: 'published',
  author: 'Admin CurhatIn'
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

function toTags(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function AdminArticlesPage() {
  const [articles, setArticles] = useState<WellnessArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  const apiBase = useMemo(() => getContentApiBase(), []);

  function adminHeaders(contentType = false): HeadersInit {
    const token = getAdminToken();
    return {
      ...(contentType ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { 'x-admin-token': token } : {})
    };
  }

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(contentApi('/api/articles?includeDraft=true'), {
        headers: adminHeaders()
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const payload = await response.json();
      setArticles(payload.articles ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memuat artikel';
      setError(`Tidak bisa mengambil data artikel: ${message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  function resetForm() {
    setEditingSlug(null);
    setForm(initialForm);
  }

  function startEdit(article: WellnessArticle) {
    setEditingSlug(article.slug);
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      body: article.body,
      tagsCsv: article.tags.join(', '),
      status: article.status,
      author: article.author
    });
  }

  async function saveArticle() {
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      body: form.body,
      tags: toTags(form.tagsCsv),
      status: form.status,
      author: form.author
    };

    const endpoint = editingSlug
      ? contentApi(`/api/articles/${editingSlug}`)
      : contentApi('/api/articles');

    const method = editingSlug ? 'PATCH' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: adminHeaders(true),
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);

      setToast(editingSlug ? 'Artikel berhasil diperbarui.' : 'Artikel baru berhasil dibuat.');
      window.setTimeout(() => setToast(null), 2600);
      resetForm();
      await fetchArticles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan artikel';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function removeArticle(slug: string) {
    if (!window.confirm('Hapus artikel ini?')) return;

    try {
      const response = await fetch(contentApi(`/api/articles/${slug}`), {
        method: 'DELETE',
        headers: adminHeaders()
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);

      setToast('Artikel dihapus.');
      window.setTimeout(() => setToast(null), 2600);
      if (editingSlug === slug) resetForm();
      await fetchArticles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus artikel';
      setError(message);
    }
  }

  return (
    <div className="space-y-4">
      <OutlinedCard className="space-y-3">
        <h1 className="text-h4 font-semibold tracking-tight">Article CMS</h1>
        <p className="text-body text-ink-soft">
          Kelola artikel wellness untuk landing page public. Endpoint aktif di <code>{apiBase || '/'}</code>.
        </p>
        <p className="text-caption text-muted">
          Setelah publish, artikel otomatis tampil di halaman <code>/articles</code>.
        </p>
      </OutlinedCard>

      {toast && <Toast message={toast} tone="success" />}
      {error && <Toast message={error} tone="error" />}

      <div className="grid gap-4 xl:grid-cols-[400px_1fr] 2xl:grid-cols-[420px_1fr]">
        <OutlinedCard className="space-y-4">
          <h2 className="text-h6 font-semibold tracking-tight">
            {editingSlug ? `Edit artikel: ${editingSlug}` : 'Tambah artikel baru'}
          </h2>

          <div className="space-y-3">
            <Input
              id="article-title"
              label="Judul"
              placeholder="Judul artikel"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />

            <Textarea
              id="article-excerpt"
              label="Excerpt"
              placeholder="Ringkasan singkat artikel"
              value={form.excerpt}
              onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
            />

            <Textarea
              id="article-body"
              label="Konten Artikel"
              hint="Pisahkan paragraf dengan baris kosong."
              className="min-h-44"
              placeholder="Tulis isi artikel di sini..."
              value={form.body}
              onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
            />

            <Input
              id="article-tags"
              label="Tags"
              hint="Pisahkan dengan koma, contoh: Anxiety, Grounding"
              placeholder="Wellness, Journaling"
              value={form.tagsCsv}
              onChange={(event) => setForm((prev) => ({ ...prev, tagsCsv: event.target.value }))}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                id="article-status"
                label="Status"
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'published', label: 'Published' }
                ]}
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value === 'published' ? 'published' : 'draft'
                  }))
                }
              />

              <Input
                id="article-author"
                label="Author"
                placeholder="Nama author"
                value={form.author}
                onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button className="w-full sm:w-auto" onClick={saveArticle} disabled={saving}>
              {saving ? 'Menyimpan...' : editingSlug ? 'Update artikel' : 'Buat artikel'}
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto" onClick={resetForm} disabled={saving}>
              Reset
            </Button>
          </div>
        </OutlinedCard>

        <OutlinedCard className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-h6 font-semibold tracking-tight">Daftar artikel</h2>
            <Button variant="secondary" onClick={fetchArticles} disabled={loading}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <LoadingState label="Memuat artikel..." />
          ) : articles.length === 0 ? (
            <EmptyState
              title="Belum ada artikel"
              description="Tambahkan artikel pertama dari panel kiri."
            />
          ) : (
            <div className="space-y-3">
              {articles.map((article) => (
                <OutlinedCard key={article.id} className="space-y-3 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={article.status === 'published' ? 'success' : 'warn'}>
                      {article.status}
                    </Badge>
                    <Badge>{article.readTimeMinutes} menit</Badge>
                    <span className="text-caption text-muted">
                      {dateFormatter.format(new Date(article.updatedAt))}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-h6 font-semibold tracking-tight">{article.title}</p>
                    <p className="text-caption text-muted">/{article.slug}</p>
                    <p className="text-body text-ink-soft">{article.excerpt}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={`${article.slug}-${tag}`}>{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Button variant="secondary" className="w-full sm:w-auto" onClick={() => startEdit(article)}>
                      Edit
                    </Button>
                    <Button variant="secondary" className="w-full sm:w-auto" onClick={() => removeArticle(article.slug)}>
                      Hapus
                    </Button>
                    {article.status === 'published' ? (
                      <a
                        href={`${apiBase}/articles/${article.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 w-full items-center justify-center rounded-md border border-border px-3 text-caption font-medium hover:bg-accent sm:w-auto"
                      >
                        Preview landing
                      </a>
                    ) : (
                      <span className="inline-flex h-9 w-full items-center justify-center rounded-md border border-border px-3 text-caption font-medium text-muted sm:w-auto">
                        Publish dulu untuk preview
                      </span>
                    )}
                  </div>
                </OutlinedCard>
              ))}
            </div>
          )}
        </OutlinedCard>
      </div>
    </div>
  );
}

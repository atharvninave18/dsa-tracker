import { useState, useMemo, useCallback, Fragment, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import {
  QUESTIONS,
  TOPICS,
  TOPIC_COLOR_MAP,
} from '../../data/seedQuestions';
import { useTracker } from '../../context/TrackerContext';
import './tracker.css';

const FILTERS = [
  { id: 'all', icon: 'ti-list', label: 'All Questions' },
  { id: 'pending', icon: 'ti-clock', label: 'Pending' },
  { id: 'done', icon: 'ti-circle-check', label: 'Done' },
  { id: 'revise', icon: 'ti-refresh', label: 'Done + Revise' },
  { id: 'review', icon: 'ti-star', label: 'Marked for Review' },
];

function linkLabel(url) {
  if (url.includes('leetcode.com')) return 'LC';
  if (url.includes('geeksforgeeks.org')) return 'GFG';
  return 'Link';
}

function linkClass(url) {
  if (url.includes('leetcode.com')) return 'link-lc';
  if (url.includes('geeksforgeeks.org')) return 'link-gfg';
  return '';
}

export default function QuestionsTracker({ searchRef }) {
  const { loading, error, getQ, updateQuestion } = useTracker();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTopic, setActiveTopic] = useState(() => searchParams.get('topic') || null);
  const [activeFilter, setActiveFilter] = useState(() => {
    const f = searchParams.get('filter');
    return FILTERS.some((x) => x.id === f) ? f : 'all';
  });
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [openNotes, setOpenNotes] = useState({});
  const [draftNotes, setDraftNotes] = useState({});
  const [focusIndex, setFocusIndex] = useState(-1);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTopic) params.set('topic', activeTopic);
    if (activeFilter !== 'all') params.set('filter', activeFilter);
    if (search) params.set('search', search);
    setSearchParams(params, { replace: true });
  }, [activeTopic, activeFilter, search, setSearchParams]);

  const stats = useMemo(() => {
    const total = QUESTIONS.length;
    const done = QUESTIONS.filter((q) => getQ(q.id).status === 'done').length;
    const revise = QUESTIONS.filter((q) => getQ(q.id).status === 'revise').length;
    const review = QUESTIONS.filter((q) => getQ(q.id).review).length;
    return { total, done, revise, review, pending: total - done - revise };
  }, [getQ]);

  const getTopicStats = useCallback(
    (topic) => {
      const qs = QUESTIONS.filter((q) => q.topic === topic);
      const done = qs.filter((q) =>
        ['done', 'revise'].includes(getQ(q.id).status)
      ).length;
      return { total: qs.length, done };
    },
    [getQ]
  );

  const filtered = useMemo(() => {
    let qs = activeTopic
      ? QUESTIONS.filter((q) => q.topic === activeTopic)
      : QUESTIONS;

    const term = search.toLowerCase();
    if (term) {
      qs = qs.filter(
        (q) =>
          q.q.toLowerCase().includes(term) ||
          q.topic.toLowerCase().includes(term)
      );
    }

    if (activeFilter === 'pending') {
      qs = qs.filter((q) => getQ(q.id).status === 'pending');
    } else if (activeFilter === 'done') {
      qs = qs.filter((q) => getQ(q.id).status === 'done');
    } else if (activeFilter === 'revise') {
      qs = qs.filter((q) => getQ(q.id).status === 'revise');
    } else if (activeFilter === 'review') {
      qs = qs.filter((q) => getQ(q.id).review);
    }

    return qs;
  }, [activeTopic, search, activeFilter, getQ]);

  const toggleNotes = useCallback((id) => {
    const opening = !openNotes[id];
    setOpenNotes((prev) => ({ ...prev, [id]: opening }));
    if (opening) {
      setDraftNotes((prev) => ({ ...prev, [id]: getQ(id).notes || '' }));
    }
  }, [openNotes, getQ]);

  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
      if (!filtered.length) return;

      if (e.key === 'j') {
        e.preventDefault();
        setFocusIndex((i) => Math.min((i < 0 ? -1 : i) + 1, filtered.length - 1));
      }
      if (e.key === 'k') {
        e.preventDefault();
        setFocusIndex((i) => Math.max((i < 0 ? 1 : i) - 1, 0));
      }
      const idx = focusIndex >= 0 ? focusIndex : 0;
      const q = filtered[idx];
      if (!q) return;
      if (e.key === '1') updateQuestion(q.id, { status: 'pending' });
      if (e.key === '2') updateQuestion(q.id, { status: 'done' });
      if (e.key === '3') updateQuestion(q.id, { status: 'revise' });
      if (e.key === 'n') toggleNotes(q.id);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [filtered, focusIndex, updateQuestion, toggleNotes]);

  const topicHeader = useMemo(() => {
    const label = activeTopic || 'All Topics';
    const qs = activeTopic
      ? QUESTIONS.filter((q) => q.topic === activeTopic)
      : QUESTIONS;
    const done = qs.filter((q) =>
      ['done', 'revise'].includes(getQ(q.id).status)
    ).length;
    const pct = qs.length ? Math.round((done / qs.length) * 100) : 0;
    return { label, done, total: qs.length, pct, color: activeTopic ? TOPIC_COLOR_MAP[activeTopic] : 'var(--accent)' };
  }, [activeTopic, getQ]);

  const saveNotes = (id) => {
    updateQuestion(id, { notes: draftNotes[id] ?? '' });
    setOpenNotes((prev) => ({ ...prev, [id]: false }));
  };

  const renderLinks = (links) => {
    if (!links.length) {
      return <span style={{ color: 'var(--text3)', fontSize: 12 }}>—</span>;
    }

    const counts = {};
    links.forEach((l) => {
      const lb = linkLabel(l);
      counts[lb] = (counts[lb] || 0) + 1;
    });

    const used = {};
    return links.map((url, i) => {
      const lb = linkLabel(url);
      used[lb] = (used[lb] || 0) + 1;
      const suffix = counts[lb] > 1 ? ` ${used[lb]}` : '';
      return (
        <a
          key={`${url}-${i}`}
          href={url}
          className={`link-btn ${linkClass(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="ti ti-external-link" style={{ fontSize: 11 }} aria-hidden="true" />
          {lb}
          {suffix}
        </a>
      );
    });
  };

  if (loading) {
    return (
      <Box className="tracker tracker-loading">
        <CircularProgress size={32} sx={{ color: 'primary.main' }} />
        <Typography variant="body2" color="text.secondary" mt={2}>
          Loading question bank…
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="tracker tracker-loading">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className="tracker">
      <div className="tracker-main">
        <aside className="tracker-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">Filter</div>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.id)}
              >
                <i className={`ti ${f.icon}`} aria-hidden="true" />
                {f.label}
                <span className="count">
                  {f.id === 'all' && stats.total}
                  {f.id === 'pending' && stats.pending}
                  {f.id === 'done' && stats.done}
                  {f.id === 'revise' && stats.revise}
                  {f.id === 'review' && stats.review}
                </span>
              </button>
            ))}
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-section">
            <div className="sidebar-label">Topics</div>
            <button
              type="button"
              className={`topic-btn ${!activeTopic ? 'active' : ''}`}
              onClick={() => setActiveTopic(null)}
            >
              <span className="topic-dot" style={{ background: 'var(--accent)' }} />
              All Topics
              <span className="topic-progress">{QUESTIONS.length}</span>
            </button>
            {TOPICS.map((topic) => {
              const ts = getTopicStats(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  className={`topic-btn ${activeTopic === topic ? 'active' : ''}`}
                  onClick={() => setActiveTopic(topic)}
                >
                  <span
                    className="topic-dot"
                    style={{ background: TOPIC_COLOR_MAP[topic] }}
                  />
                  <span style={{ flex: 1, textAlign: 'left' }}>{topic}</span>
                  <span className="topic-progress">
                    {ts.done}/{ts.total}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="tracker-content">
          <div className="tracker-toolbar">
            <div className="search-box">
              <i className="ti ti-search" aria-hidden="true" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, whiteSpace: 'nowrap' }}>
              j/k navigate · 1/2/3 status · n notes
            </Typography>
          </div>

          <div className="topic-header">
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: topicHeader.color,
                flexShrink: 0,
              }}
            />
            <div className="topic-header-info">
              <h2>{topicHeader.label}</h2>
              <div className="prog-bar-outer">
                <div
                  className="prog-bar-inner"
                  style={{ width: `${topicHeader.pct}%` }}
                />
              </div>
              <div className="prog-text">
                {topicHeader.done} of {topicHeader.total} completed · {topicHeader.pct}%
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <i className="ti ti-mood-empty" aria-hidden="true" />
              <p>No questions match your filter.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Links</th>
                    <th>Status</th>
                    <th>Review</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q, rowIndex) => {
                    const qstate = getQ(q.id);
                    const hasNotes = Boolean(qstate.notes?.trim());
                    const isOpen = openNotes[q.id];
                    const isFocused = rowIndex === focusIndex;

                    return (
                      <Fragment key={q.id}>
                        <tr className={isFocused ? 'row-focused' : ''}>
                          <td style={{ width: '36%' }}>
                            <div className="q-cell">
                              <div className="q-name">{q.q}</div>
                              <div className="q-topic">
                                <span
                                  style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: TOPIC_COLOR_MAP[q.topic],
                                    display: 'inline-block',
                                  }}
                                />
                                {q.topic}
                              </div>
                            </div>
                          </td>
                          <td style={{ width: '18%' }}>
                            <div className="links-cell">{renderLinks(q.links)}</div>
                          </td>
                          <td style={{ width: '16%' }}>
                            <select
                              className={`status-select status-${qstate.status}`}
                              value={qstate.status}
                              onChange={(e) =>
                                updateQuestion(q.id, { status: e.target.value })
                              }
                            >
                              <option value="pending">⏳ Pending</option>
                              <option value="done">✅ Done</option>
                              <option value="revise">🔁 Done + Revise</option>
                            </select>
                          </td>
                          <td style={{ width: '14%' }}>
                            <div
                              className="review-toggle"
                              onClick={() => updateQuestion(q.id, { review: !qstate.review })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  updateQuestion(q.id, { review: !qstate.review });
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              <div
                                className={`toggle-track ${qstate.review ? 'on' : ''}`}
                              >
                                <div className="toggle-thumb" />
                              </div>
                              <span
                                className={`review-label ${qstate.review ? 'on' : ''}`}
                              >
                                {qstate.review ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </td>
                          <td style={{ width: '16%' }}>
                            <button
                              type="button"
                              className={`notes-btn ${hasNotes ? 'has-notes' : ''}`}
                              onClick={() => toggleNotes(q.id)}
                            >
                              <i className="ti ti-notes" aria-hidden="true" />
                              {hasNotes ? 'View note' : 'Add note'}
                            </button>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr>
                            <td colSpan={5} style={{ padding: 0 }}>
                              <div className="notes-drawer open">
                                <textarea
                                  placeholder="Write your notes, approach, edge cases..."
                                  value={draftNotes[q.id] ?? qstate.notes ?? ''}
                                  onChange={(e) =>
                                    setDraftNotes((prev) => ({
                                      ...prev,
                                      [q.id]: e.target.value,
                                    }))
                                  }
                                />
                                <div className="notes-actions">
                                  <button
                                    type="button"
                                    className="btn-save"
                                    onClick={() => saveNotes(q.id)}
                                  >
                                    <i
                                      className="ti ti-device-floppy"
                                      aria-hidden="true"
                                    />
                                    Save
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

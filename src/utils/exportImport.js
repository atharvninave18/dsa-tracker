import { createBackup } from './storage';
import { parseCategoryInfo, normalizeQuestion } from './helpers';

/** Convert questions array to CSV string */
export function exportToCSV(questions) {
  const headers = [
    'name', 'link', 'status', 'reviewDate', 'notes', 'difficulty',
    'tags', 'platform', 'group', 'groupType', 'groupOrder',
    'dateAdded', 'lastUpdated', 'isFavorite', 'priority', 'solvedAt',
  ];

  const escape = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = questions.map((q) =>
    headers.map((h) => {
      if (h === 'tags') return escape((q.tags || []).join(';'));
      return escape(q[h]);
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function isHeaderRow(cells) {
  const joined = cells.join(' ').toLowerCase();
  return (
    joined.includes('question') ||
    joined.includes('link') ||
    joined.includes('category') ||
    joined.includes('topic')
  );
}

function detectPlatform(url) {
  if (!url) return 'Custom';
  const u = url.toLowerCase();
  if (u.includes('leetcode.com')) return 'LeetCode';
  if (u.includes('geeksforgeeks.org') || u.includes('gfg.org')) return 'GFG';
  if (u.includes('codeforces.com')) return 'Codeforces';
  if (u.includes('hackerrank.com')) return 'HackerRank';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'Custom';
  return 'Custom';
}

function parseDifficulty(text) {
  const m = text.match(/\((easy|medium|hard)\)/i);
  if (!m) return { difficulty: 'Medium', name: text.trim() };
  const difficulty = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
  const name = text.replace(/\((easy|medium|hard)\)/i, '').trim();
  return { difficulty, name };
}

function isUrl(val) {
  return /^https?:\/\//i.test(val?.trim?.() || '');
}

/** Parse spreadsheet-style or app-export CSV into question objects */
export function importFromCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) throw new Error('CSV file is empty');

  const firstCells = parseCSVLine(lines[0]);
  const hasHeader = isHeaderRow(firstCells);
  const dataLines = hasHeader ? lines.slice(1) : lines;

  if (dataLines.length === 0) throw new Error('No data rows found in CSV');

  const now = new Date().toISOString();
  let currentCategory = '';
  const sectionOrder = new Map();
  let nextGroupOrder = 0;
  let rowIndex = 0;

  const assignGroup = (category) => {
    const { group, groupType, tags } = parseCategoryInfo(category);
    const key = `${groupType}::${group}`;
    if (!sectionOrder.has(key)) sectionOrder.set(key, nextGroupOrder++);
    return { group, groupType, groupOrder: sectionOrder.get(key), tags };
  };

  return dataLines
    .map((line) => {
      const cells = parseCSVLine(line).map((c) => c.trim());
      if (cells.every((c) => !c)) return null;

      // App-export format (has named columns)
      if (hasHeader && firstCells.some((h) => h.toLowerCase() === 'name')) {
        const row = {};
        firstCells.forEach((h, i) => {
          row[h.trim().toLowerCase()] = cells[i]?.trim() ?? '';
        });
        return {
          id: crypto.randomUUID(),
          name: row.name || 'Untitled',
          link: row.link || '',
          status: row.status || 'Pending',
          reviewDate: row.reviewdate || '',
          notes: row.notes || '',
          difficulty: row.difficulty || 'Medium',
          tags: row.tags ? row.tags.split(';').map((t) => t.trim()).filter(Boolean) : [],
          platform: row.platform || detectPlatform(row.link),
          group: row.group || row.tags?.split(';')[0] || 'Uncategorized',
          groupType: row.grouptype || 'topic',
          groupOrder: parseInt(row.grouporder, 10) || 0,
          dateAdded: row.dateadded || now,
          lastUpdated: row.lastupdated || now,
          isFavorite: row.isfavorite === 'true',
          priority: parseInt(row.priority, 10) || rowIndex++,
          solvedAt: row.solvedat || null,
        };
      }

      // Spreadsheet format: Category | Question | Link1 | Link2 | Link3 | Link4
      const [col0, col1, col2, col3, col4, col5] = cells;

      if (col0 && !col1 && !isUrl(col0)) {
        currentCategory = col0;
        return null;
      }

      const questionRaw = col1 || col0;
      if (!questionRaw || questionRaw.toLowerCase() === 'question') return null;

      if (col0 && !isUrl(col0) && col1) currentCategory = col0;

      const { difficulty, name } = parseDifficulty(questionRaw);
      const { group, groupType, groupOrder, tags } = assignGroup(currentCategory);
      const links = [col2, col3, col4, col5].filter(isUrl);
      const primaryLink = links[0] || '';
      const extraLinks = links.slice(1);
      const notes = extraLinks.length
        ? extraLinks.map((l, i) => `- [Link ${i + 2}](${l})`).join('\n')
        : '';

      return {
        id: crypto.randomUUID(),
        name,
        link: primaryLink,
        status: 'Pending',
        reviewDate: '',
        notes,
        difficulty,
        tags,
        group,
        groupType,
        groupOrder,
        platform: detectPlatform(primaryLink),
        dateAdded: now,
        lastUpdated: now,
        isFavorite: false,
        priority: rowIndex++,
        solvedAt: null,
      };
    })
    .filter(Boolean)
    .map(normalizeQuestion);
}

export function exportToJSON(questions, settings, goals) {
  return JSON.stringify(createBackup(questions, settings, goals), null, 2);
}

export function importFromJSON(jsonText) {
  const data = JSON.parse(jsonText);
  if (Array.isArray(data)) {
    return { questions: data, settings: null, goals: null };
  }
  if (data.questions && Array.isArray(data.questions)) {
    return {
      questions: data.questions,
      settings: data.settings || null,
      goals: data.goals || null,
    };
  }
  throw new Error('Invalid JSON format');
}

export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

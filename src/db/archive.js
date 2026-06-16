import db from './localbase';
import { ARCHIVE_COLLECTION, ARCHIVE_VERSION, ARCHIVE_VERSION_KEY } from './constants';
import { topicKey } from './helpers';
import {
  applyLegacyProgress,
  buildSeedArchive,
  loadLegacyProgress,
} from './buildArchive';
import { PROGRESS_STORAGE_KEY } from '../data/seedQuestions';

export { topicKey };

export async function insertData() {
  const legacy = loadLegacyProgress();
  let archive = buildSeedArchive();
  if (Object.keys(legacy).length > 0) {
    archive = applyLegacyProgress(archive, legacy);
  }

  await Promise.all(
    archive.map((topic) =>
      db.collection(ARCHIVE_COLLECTION).add(topic, topicKey(topic.topicName))
    )
  );

  localStorage.removeItem(PROGRESS_STORAGE_KEY);
  localStorage.setItem(ARCHIVE_VERSION_KEY, String(ARCHIVE_VERSION));
  return archive.sort((a, b) => a.position - b.position);
}

export async function getData() {
  const data = await db.collection(ARCHIVE_COLLECTION).get();
  const rows = Array.isArray(data) ? data : [];

  if (rows.length === 0) {
    return insertData();
  }

  rows.sort((a, b) => a.position - b.position);

  const localVersion = localStorage.getItem(ARCHIVE_VERSION_KEY);
  const storedVersion = localVersion === null ? null : parseInt(localVersion, 10);

  if (storedVersion === null) {
    localStorage.setItem(ARCHIVE_VERSION_KEY, String(ARCHIVE_VERSION));
    return rows;
  }

  if (storedVersion !== ARCHIVE_VERSION) {
    return migrateVersion(rows);
  }

  return rows;
}

async function migrateVersion(existingData) {
  const existingByKey = Object.fromEntries(
    existingData.map((t) => [topicKey(t.topicName), t])
  );
  const fresh = buildSeedArchive(existingData);
  const freshKeys = new Set(fresh.map((t) => topicKey(t.topicName)));

  for (const topic of fresh) {
    const key = topicKey(topic.topicName);
    if (existingByKey[key]) {
      await updateDBData(key, {
        topicName: topic.topicName,
        position: topic.position,
        started: topic.started,
        doneQuestions: topic.doneQuestions,
        questions: topic.questions,
      });
    } else {
      await db.collection(ARCHIVE_COLLECTION).add(topic, key);
    }
  }

  for (const old of existingData) {
    const key = topicKey(old.topicName);
    if (!freshKeys.has(key)) {
      await db.collection(ARCHIVE_COLLECTION).doc(key).delete();
    }
  }

  localStorage.setItem(ARCHIVE_VERSION_KEY, String(ARCHIVE_VERSION));
  return fresh.sort((a, b) => a.position - b.position);
}

export async function getTopicData(key) {
  return db.collection(ARCHIVE_COLLECTION).doc(key).get();
}

export async function updateDBData(key, updateData) {
  return db.collection(ARCHIVE_COLLECTION).doc(key).update(updateData);
}

export async function resetDBData() {
  await db.collection(ARCHIVE_COLLECTION).delete();
  localStorage.removeItem(ARCHIVE_VERSION_KEY);
  return insertData();
}

export async function exportDBData() {
  const data = await db.collection(ARCHIVE_COLLECTION).get();
  const rows = Array.isArray(data) ? data : [];
  rows.sort((a, b) => a.position - b.position);
  return {
    version: ARCHIVE_VERSION,
    exportedAt: new Date().toISOString(),
    topics: rows,
  };
}

export async function importDBData(data) {
  const topics = data?.topics ?? data;
  if (!Array.isArray(topics) || topics.length === 0) {
    throw new Error('Invalid archive format: expected topics array');
  }

  await db.collection(ARCHIVE_COLLECTION).delete();

  await Promise.all(
    topics.map((topic) =>
      db.collection(ARCHIVE_COLLECTION).add(topic, topicKey(topic.topicName))
    )
  );

  localStorage.setItem(ARCHIVE_VERSION_KEY, String(ARCHIVE_VERSION));
  return getData();
}

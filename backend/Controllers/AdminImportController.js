const fs = require('fs');
const ExcelJS = require('exceljs');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Alumni = require('../Models/alumni');
const ImportJob = require('../Models/importJob');

const BRANCH_ALIASES = {
  'AE&I': 'AEIE',
  'AEI': 'AEIE',
  'AEIE': 'AEIE',
  'AG': 'AGRICULTURE',
  'AGE': 'AGRICULTURE',
  'AGRI': 'AGRICULTURE',
  'BIO-TECH': 'BIOTECH',
  'BIO TECH': 'BIOTECH',
  BIOTECH: 'BIOTECH',
  BT: 'BIOTECH',
  'IND.BIO TECH': 'BIOTECH',
  CHEM: 'CHEMICAL',
  CIVIL: 'CIVIL',
  CSE: 'CSE',
  'CSE AIML': 'CSE AIML',
  'CSE DS': 'CSE DS',
  CST: 'CST',
  ECE: 'ECE',
  EE: 'EE',
  EEE: 'EEE',
  EIE: 'EIE',
  ETCE: 'ETCE',
  IT: 'IT',
  MECH: 'MECH',
  META: 'METALLURGY',
  PCPR: 'PCPR'
};

const HEADER_PATTERNS = {
  rollNo: [
    'roll',
    'regd',
    'registration',
    'reg no',
    'usn',
    'university registration number',
    'university regd no',
    'university reg no'
  ],
  fullName: ['name of the alumni', 'name', 'student name', 'full name'],
  branch: ['branch', 'department', 'dept'],
  batch: ['batch pass out', 'batch', 'graduation year', 'pass out'],
  course: ['course', 'program', 'programme', 'degree'],
  dob: ['d o b', 'dob', 'date of birth', 'birth'],
  collegeEmail: ['email id', 'college email', 'email'],
  mobile: ['mobile', 'phone', 'contact'],
  gender: ['gender', 'sex', 'm f'],
  dateOfMarriage: ['date of marriage', 'marriage date', 'dom'],
  currentCompany: ['current company', 'company', 'organization', 'organisation'],
  designation: ['designation', 'job title', 'role', 'position'],
  currentLocation: ['current location', 'location', 'city'],
  parentsMobile: ['parents mobile', 'parent mobile', 'guardian mobile', 'father mobile', 'mother mobile'],
  personalEmail: ['personal mail id', 'personal email', 'mail id', 'personal mail'],
  fatherName: ['father name', 'fathers name'],
  motherName: ['mother name', 'mothers name'],
  religion: ['religion'],
  higherStudy: ['higher study', 'higher studies', 'higher education'],
  permanentAddress: ['permanent address', 'address'],
  dateOfVisit: ['date of visit', 'visit date', 'date visited'],
  linkedin: ['linkedin', 'linkedin url'],
  github: ['github', 'github url']
};

function normalizeText(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim();
}

function normalizeBranch(rawBranch) {
  const normalized = normalizeText(rawBranch).toUpperCase();
  return BRANCH_ALIASES[normalized] || normalized;
}

function inferHeaderRow(rows) {
  let bestIdx = 0;
  let bestScore = -1;

  rows.forEach((row, idx) => {
    const joined = row.map((c) => normalizeText(c).toLowerCase()).join(' | ');
    const nonEmpty = row.filter((c) => normalizeText(c)).length;
    let score = nonEmpty;

    if (joined.includes('roll') || joined.includes('regd')) score += 4;
    if (joined.includes('name')) score += 3;
    if (joined.includes('branch')) score += 3;
    if (joined.includes('batch')) score += 2;

    if (score > bestScore) {
      bestIdx = idx;
      bestScore = score;
    }
  });

  return bestIdx;
}

function findColumnIndexes(headerRow) {
  const indexes = {};
  // ExcelJS row arrays can be sparse when header cells are blank;
  // Array.from ensures every position becomes a concrete value.
  const normalizedHeaders = Array.from(headerRow || [], (cell) => normalizeText(cell).toLowerCase());

  Object.entries(HEADER_PATTERNS).forEach(([target, patterns]) => {
    const safePatterns = (patterns || []).filter(Boolean);
    const idx = normalizedHeaders.findIndex((header) => safePatterns.some((pattern) => header.includes(pattern)));
    if (idx >= 0) indexes[target] = idx;
  });

  return indexes;
}

function excelSerialToDate(value, date1904 = false) {
  const serial = Number(value);
  if (Number.isNaN(serial)) {
    return null;
  }

  const baseDate = date1904 ? 24107 : 25569;
  return new Date(Math.round((serial - baseDate) * 86400000));
}

function parseExcelDate(value, date1904 = false) {
  if (value === null || value === undefined || value === '') return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === 'number') {
    const converted = excelSerialToDate(value, date1904);
    if (converted && !Number.isNaN(converted.getTime())) return converted;
  }

  const text = normalizeText(value);
  if (!text) return null;

  const parsedDate = new Date(text);
  if (!Number.isNaN(parsedDate.getTime())) return parsedDate;

  const parts = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (parts) {
    const d = Number(parts[1]);
    const m = Number(parts[2]);
    let y = Number(parts[3]);
    if (y < 100) y += 1900;
    const dt = new Date(y, m - 1, d);
    if (!Number.isNaN(dt.getTime())) return dt;
  }

  return null;
}

function toTempPassword(dobDate) {
  if (!dobDate) return '';
  const dd = String(dobDate.getDate()).padStart(2, '0');
  const mm = String(dobDate.getMonth() + 1).padStart(2, '0');
  const yyyy = String(dobDate.getFullYear());
  return `${dd}${mm}${yyyy}`;
}

function fallbackTempPassword(rollNo) {
  const cleaned = normalizeText(rollNo).replace(/[^a-zA-Z0-9]/g, '');
  const tail = cleaned.slice(-6).padStart(6, '0');
  return `${tail}123`;
}

function yearFromFileName(name) {
  const match = name.match(/(20\d{2})/);
  return match ? Number(match[1]) : null;
}

function buildEmail(rollNo, providedEmail) {
  const email = normalizeText(providedEmail).toLowerCase();
  if (email && email.includes('@')) return email;
  return `${normalizeText(rollNo).toLowerCase()}@alumni.giet.edu`;
}

function getCell(row, idx) {
  if (idx === undefined) return '';
  return normalizeText(row[idx]);
}

function sanitizeYearKey(value) {
  const year = Number(value);
  if (Number.isFinite(year) && year >= 1900 && year <= 3000) return String(year);
  return 'unknown';
}

async function upsertYearCollections(records, sourceFile) {
  if (!records.length) return {};

  const grouped = new Map();
  records.forEach((record) => {
    const key = sanitizeYearKey(record.batch);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(record);
  });

  const yearTables = {};

  for (const [year, rows] of grouped.entries()) {
    const collectionName = `alumni_year_${year}`;
    const collection = mongoose.connection.collection(collectionName);

    const ops = rows.map((row) => ({
      updateOne: {
        filter: { registrationNumber: row.rollNo },
        update: {
          $set: {
            registrationNumber: row.rollNo,
            fullName: row.fullName,
            graduationYear: Number(row.batch) || null,
            course: row.course,
            branch: row.branch,
            collegeEmail: row.collegeEmail,
            mobile: row.mobile,
            gender: row.gender,
            parentsMobile: row.parentsMobile,
            personalEmail: row.personalEmail,
            fatherName: row.fatherName,
            motherName: row.motherName,
            religion: row.religion,
            higherStudy: row.higherStudy,
            permanentAddress: row.permanentAddress,
            linkedin: row.linkedin,
            github: row.github,
            sourceFile,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        upsert: true
      }
    }));

    const result = await collection.bulkWrite(ops, { ordered: false });
    yearTables[year] = {
      collection: collectionName,
      totalRows: rows.length,
      inserted: result?.upsertedCount || 0,
      updated: result?.modifiedCount || 0,
      matched: result?.matchedCount || 0
    };
  }

  return yearTables;
}

async function parseWorkbook(fileInput, fileName, options = {}) {
  const workbook = new ExcelJS.Workbook();

  // Support both memory uploads (Buffer) and disk uploads (file path)
  if (Buffer.isBuffer(fileInput)) {
    await workbook.xlsx.load(fileInput);
  } else {
    await workbook.xlsx.readFile(fileInput);
  }
  const sheet = workbook.worksheets[0];
  const rows = [];

  if (sheet) {
    sheet.eachRow({ includeEmpty: true }, (row) => {
      rows.push(row.values.slice(1));
    });
  }

  if (!rows.length) {
    return { records: [], errors: [{ row: 0, reason: 'Sheet is empty' }] };
  }

  const headerRowIdx = inferHeaderRow(rows.slice(0, 15));
  const headerRow = rows[headerRowIdx] || [];
  const columns = findColumnIndexes(headerRow);

  const batchFromFile = yearFromFileName(fileName);
  const defaultCourse = normalizeText(options.defaultCourse || 'BTECH').toUpperCase();
  const date1904 = Boolean(workbook.properties && workbook.properties.date1904);

  const records = [];
  const errors = [];

  for (let i = headerRowIdx + 1; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const rowNumber = i + 1;

    const batchText = getCell(row, columns.batch);
    const batch = Number(batchText) || Number(options.defaultBatch) || batchFromFile || new Date().getFullYear();

    const rollNoRaw = getCell(row, columns.rollNo).toUpperCase();
    const rollNo = rollNoRaw;
    const fullName = normalizeText(getCell(row, columns.fullName));
    const branchRaw = getCell(row, columns.branch) || options.defaultBranch || '';
    const branch = normalizeBranch(branchRaw || '');
    const course = normalizeText(getCell(row, columns.course) || options.course || defaultCourse).toUpperCase();
    const dob = parseExcelDate(row[columns.dob], date1904);
    const tempPassword = toTempPassword(dob) || fallbackTempPassword(rollNo);
    const collegeEmail = buildEmail(rollNo, getCell(row, columns.collegeEmail));
    const mobile = normalizeText(getCell(row, columns.mobile));
    const gender = normalizeText(getCell(row, columns.gender));
    const dateOfMarriage = parseExcelDate(row[columns.dateOfMarriage], date1904);
    const currentCompany = normalizeText(getCell(row, columns.currentCompany));
    const designation = normalizeText(getCell(row, columns.designation));
    const currentLocation = normalizeText(getCell(row, columns.currentLocation));
    const parentsMobile = normalizeText(getCell(row, columns.parentsMobile));
    const personalEmailRaw = normalizeText(getCell(row, columns.personalEmail));
    const personalEmail = personalEmailRaw && personalEmailRaw.includes('@') ? personalEmailRaw.toLowerCase() : '';
    const fatherName = normalizeText(getCell(row, columns.fatherName));
    const motherName = normalizeText(getCell(row, columns.motherName));
    const religion = normalizeText(getCell(row, columns.religion));
    const higherStudy = normalizeText(getCell(row, columns.higherStudy));
    const permanentAddress = normalizeText(getCell(row, columns.permanentAddress));
    const linkedin = normalizeText(getCell(row, columns.linkedin));
    const github = normalizeText(getCell(row, columns.github));

    // Date of visit is admin-managed only; import initializes as empty list.
    const dateOfVisit = [];

    const isRowEmpty = row.every((cell) => !normalizeText(cell));
    if (isRowEmpty) continue;

    if (!rollNo || !fullName) {
      errors.push({
        row: rowNumber,
        rollNo: rollNo || '',
        reason: 'Missing required values (University Registration Number / Name of the Alumni)'
      });
      continue;
    }

    records.push({
      rowNumber,
      rollNo,
      fullName,
      branchRaw,
      branch,
      course,
      batch,
      dob,
      tempPassword,
      collegeEmail,
      mobile,
      gender,
      dateOfMarriage,
      currentCompany,
      designation,
      currentLocation,
      parentsMobile,
      personalEmail,
      fatherName,
      motherName,
      religion,
      higherStudy,
      permanentAddress,
      dateOfVisit,
      linkedin,
      github
    });
  }

  return { records, errors };
}

function summarizeRecords(records) {
  const branchCounts = {};
  const courseCounts = {};
  const batchCounts = {};

  records.forEach((r) => {
    branchCounts[r.branch] = (branchCounts[r.branch] || 0) + 1;
    courseCounts[r.course] = (courseCounts[r.course] || 0) + 1;
    batchCounts[r.batch] = (batchCounts[r.batch] || 0) + 1;
  });

  return {
    totalValidRows: records.length,
    branches: branchCounts,
    courses: courseCounts,
    batches: batchCounts
  };
}

async function sendWebhook(url, payload) {
  if (!url) {
    return { configured: false, success: false, status: 'skipped' };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return {
      configured: true,
      success: response.ok,
      status: response.status
    };
  } catch (error) {
    return {
      configured: true,
      success: false,
      status: 'failed',
      error: error.message
    };
  }
}

const importAlumniFromExcel = async (req, res) => {
  const mode = normalizeText(req.query.mode || req.body.mode || 'preview').toLowerCase();
  const file = req.file;

  if (!['preview', 'commit'].includes(mode)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid mode. Use preview or commit.'
    });
  }

  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'Excel file is required'
    });
  }

  try {
    const workbookSource = file.buffer || file.path;
    const { records, errors } = await parseWorkbook(workbookSource, file.originalname, {
      defaultCourse: req.body.defaultCourse,
      defaultBranch: req.body.defaultBranch,
      defaultBatch: req.body.defaultBatch,
      batch: req.body.batch,
      course: req.body.course
    });

    const summary = summarizeRecords(records);

    if (mode === 'preview') {
      await ImportJob.create({
        fileName: file.originalname,
        mode,
        status: 'success',
        uploadedBy: req.user?._id,
        uploadedByName: req.user?.fullName || 'Admin',
        summary,
        errorCount: errors.length,
        rowErrors: errors.slice(0, 50)
      });

      return res.status(200).json({
        success: true,
        mode: 'preview',
        fileName: file.originalname,
        summary,
        errorCount: errors.length,
        errors: errors.slice(0, 200),
        previewRows: records.slice(0, 20)
      });
    }

    const ops = [];
    let passwordResets = 0;
    const credentialPayload = [];

    for (const record of records) {
      const passwordHash = await bcrypt.hash(record.tempPassword, 10);
      passwordResets += 1;

      ops.push({
        updateOne: {
          filter: { registrationNumber: record.rollNo },
          update: {
            $set: {
              fullName: record.fullName,
              registrationNumber: record.rollNo,
              usn: record.rollNo,
              collegeEmail: record.collegeEmail,
              graduationYear: Number(record.batch),
              course: record.course,
              branch: record.branch,
              fieldOfStudy: record.branch,
              password: passwordHash,
              passwordResetRequired: true,
              verified: true,
              role: 'alumni',
              importSource: file.originalname,
              dob: record.dob || null,
              dateOfMarriage: record.dateOfMarriage || null,
              mobile: record.mobile,
              gender: record.gender,
              currentCompany: record.currentCompany,
              designation: record.designation,
              currentLocation: record.currentLocation,
              parentsMobile: record.parentsMobile,
              personalEmail: record.personalEmail,
              fatherName: record.fatherName,
              motherName: record.motherName,
              religion: record.religion,
              higherStudy: record.higherStudy,
              permanentAddress: record.permanentAddress,
              linkedin: record.linkedin,
              github: record.github
            },
            $setOnInsert: {
              dateOfVisit: [],
              profilePhoto: ''
            }
          },
          upsert: true
        }
      });

      credentialPayload.push({
        fullName: record.fullName,
        rollNo: record.rollNo,
        password: record.tempPassword,
        email: record.collegeEmail,
        mobile: record.mobile || ''
      });
    }

    const writeResult = ops.length ? await Alumni.bulkWrite(ops, { ordered: false }) : null;
    const yearTables = await upsertYearCollections(records, file.originalname);

    const imported = {
      inserted: writeResult?.upsertedCount || 0,
      updated: writeResult?.modifiedCount || 0,
      matched: writeResult?.matchedCount || 0,
      passwordsSet: passwordResets,
      yearTables
    };

    const emailWebhookUrl = process.env.EMAIL_WEBHOOK_URL || '';
    const smsWebhookUrl = process.env.SMS_WEBHOOK_URL || '';

    const [emailDelivery, smsDelivery] = await Promise.all([
      sendWebhook(emailWebhookUrl, {
        type: 'bulk_credentials',
        source: file.originalname,
        users: credentialPayload
      }),
      sendWebhook(smsWebhookUrl, {
        type: 'bulk_credentials',
        source: file.originalname,
        users: credentialPayload
      })
    ]);

    const notifications = {
      usersIncluded: credentialPayload.length,
      email: emailDelivery,
      sms: smsDelivery
    };

    await ImportJob.create({
      fileName: file.originalname,
      mode,
      status: 'success',
      uploadedBy: req.user?._id,
      uploadedByName: req.user?.fullName || 'Admin',
      summary,
      errorCount: errors.length,
      rowErrors: errors.slice(0, 50),
      imported: {
        ...imported,
        notifications
      }
    });

    return res.status(200).json({
      success: true,
      mode: 'commit',
      fileName: file.originalname,
      summary,
      errorCount: errors.length,
      errors: errors.slice(0, 200),
      imported,
      notifications
    });
  } catch (error) {
    console.error('Bulk alumni import failed:', error);
    try {
      const failureReason = error?.message || 'Import failed before row validation';
      await ImportJob.create({
        fileName: file?.originalname || 'unknown',
        mode: mode === 'commit' ? 'commit' : 'preview',
        status: 'failed',
        uploadedBy: req.user?._id,
        uploadedByName: req.user?.fullName || 'Admin',
        errorMessage: failureReason,
        errorCount: 1,
        rowErrors: [{ row: 0, rollNo: '', reason: failureReason }]
      });
    } catch (logError) {
      console.error('Failed to persist import failure log:', logError.message);
    }

    return res.status(500).json({
      success: false,
      message: 'Bulk alumni import failed',
      error: error.message
    });
  } finally {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};

const getImportHistory = async (req, res) => {
  try {
    const jobs = await ImportJob.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-rowErrors');

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error('Failed to fetch import history:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch import history' });
  }
};

const getImportHistoryById = async (req, res) => {
  try {
    const job = await ImportJob.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Import job not found' });
    }

    return res.status(200).json({ success: true, job });
  } catch (error) {
    console.error('Failed to fetch import history detail:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch import history detail' });
  }
};

module.exports = {
  importAlumniFromExcel,
  getImportHistory,
  getImportHistoryById
};

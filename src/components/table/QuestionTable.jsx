import { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import { useDsa } from '../../context/DsaContext';
import { useToast } from '../../context/ToastContext';
import QuestionGroupView from './QuestionGroupView';
import QuestionRowHeader from './QuestionRowHeader';
import TableToolbar from './TableToolbar';
import QuestionModal from '../modals/QuestionModal';
import NotesModal from '../modals/NotesModal';
import ConfirmDialog from '../modals/ConfirmDialog';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import { QUESTION_ROW_MIN_WIDTH } from './questionRowLayout';
import Panel from '../common/Panel';

const QuestionTable = forwardRef(function QuestionTable(_props, ref) {
  const {
    groupedSections,
    filteredQuestions,
    totalFiltered,
    selectedIds,
    dispatch,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    bulkUpdate,
    bulkDelete,
  } = useDsa();
  const { showToast } = useToast();
  const { confirm, dialogProps } = useConfirmDialog();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesQuestion, setNotesQuestion] = useState(null);

  const handleAdd = useCallback(() => {
    setEditingQuestion(null);
    setModalOpen(true);
  }, []);

  useImperativeHandle(ref, () => ({ openAdd: handleAdd }), [handleAdd]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingQuestion(null);
  }, []);

  const handleOpenNotes = useCallback((question) => {
    setNotesQuestion(question);
    setNotesOpen(true);
  }, []);

  const handleCloseNotes = useCallback(() => {
    setNotesOpen(false);
    setNotesQuestion(null);
  }, []);

  const handleToggleSelect = useCallback((id) => {
    dispatch({ type: 'TOGGLE_SELECT', payload: id });
  }, [dispatch]);

  const handleSave = (form) => {
    if (editingQuestion) {
      updateQuestion(editingQuestion.id, form);
      showToast('Question updated');
    } else {
      addQuestion(form);
      showToast('Question added');
    }
  };

  const handleSaveNotes = (notes) => {
    if (notesQuestion) {
      updateQuestion(notesQuestion.id, { notes });
      showToast('Notes saved');
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Delete question?', message: 'This cannot be undone.' });
    if (ok) {
      deleteQuestion(id);
      showToast('Question deleted');
    }
  };

  const handleBulkDelete = async () => {
    const ok = await confirm({
      title: 'Delete selected?',
      message: `${selectedIds.length} question(s) will be removed.`,
    });
    if (ok) {
      bulkDelete();
      showToast(`Deleted ${selectedIds.length} question(s)`);
    }
  };

  const handleBulkDone = () => {
    bulkUpdate({ status: 'Done', solvedAt: new Date().toISOString() });
    showToast(`Marked ${selectedIds.length} as done`);
  };

  const handleBulkReviewDate = (date) => {
    bulkUpdate({ reviewDate: date });
    showToast('Review date updated');
  };

  const allSelected = filteredQuestions.length > 0 && filteredQuestions.every((q) => selectedIds.includes(q.id));

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      dispatch({ type: 'SET_SELECTED', payload: filteredQuestions.map((q) => q.id) });
    } else {
      dispatch({ type: 'SET_SELECTED', payload: [] });
    }
  };

  const modals = (
    <>
      <QuestionModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        question={editingQuestion}
      />
      <NotesModal
        open={notesOpen}
        onClose={handleCloseNotes}
        onSave={handleSaveNotes}
        question={notesQuestion}
      />
      <ConfirmDialog {...dialogProps} />
    </>
  );

  if (totalFiltered === 0) {
    return (
      <>
        <Panel noPadding>
          <TableToolbar
            selectedCount={0}
            totalFiltered={0}
            onAdd={handleAdd}
            onBulkDone={handleBulkDone}
            onBulkDelete={handleBulkDelete}
            onBulkReviewDate={handleBulkReviewDate}
          />
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography color="text.secondary">No questions match your filters.</Typography>
          </Box>
        </Panel>
        {modals}
      </>
    );
  }

  return (
    <>
      <Panel noPadding>
        <TableToolbar
          selectedCount={selectedIds.length}
          totalFiltered={totalFiltered}
          onAdd={handleAdd}
          onBulkDone={handleBulkDone}
          onBulkDelete={handleBulkDelete}
          onBulkReviewDate={handleBulkReviewDate}
        />

        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={<Checkbox size="small" checked={allSelected} onChange={handleSelectAll} />}
            label={<Typography variant="body2" color="text.secondary">Select all</Typography>}
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {groupedSections.length} sections · {totalFiltered} questions
          </Typography>
        </Box>

        <Box sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
          <Box sx={{ minWidth: { md: QUESTION_ROW_MIN_WIDTH } }}>
            <QuestionRowHeader />
            <Box sx={{ p: { xs: 1.5, md: 2 }, pt: { md: 1 } }}>
              <QuestionGroupView
                groupedSections={groupedSections}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onUpdate={updateQuestion}
                onNotes={handleOpenNotes}
                onDelete={handleDelete}
              />
            </Box>
          </Box>
        </Box>
      </Panel>
      {modals}
    </>
  );
});

export default QuestionTable;

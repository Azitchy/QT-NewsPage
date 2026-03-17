import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Pencil, Trash2, X } from "lucide-react";

type Dialogue = {
  id: number;
  question: string;
  answer: string;
  open?: boolean;
};

export default function AvatarTrain() {
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const addDialogue = () => {
    if (!question || !answer) return;

    if (editingId) {
      // Update existing dialogue
      setDialogues((prev) =>
        prev.map((d) => (d.id === editingId ? { ...d, question, answer } : d)),
      );
    } else {
      // Add new dialogue
      const newDialogue: Dialogue = {
        id: Date.now(),
        question,
        answer,
        open: true,
      };

      setDialogues([newDialogue, ...dialogues]);
    }

    setQuestion("");
    setAnswer("");
    setEditingId(null);
    setShowForm(false);
  };

  const toggleDialogue = (id: number) => {
    setDialogues((prev) =>
      prev.map((d) => (d.id === id ? { ...d, open: !d.open } : d)),
    );
  };

  const editDialogue = (dialogue: Dialogue) => {
    setQuestion(dialogue.question);
    setAnswer(dialogue.answer);
    setEditingId(dialogue.id);
    setShowForm(true);
  };

  const deleteDialogue = (id: number) => {
    setDialogues(dialogues.filter((d) => d.id !== id));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const confirmDeleteFile = () => {
    if (fileToDelete !== null) {
      setFiles(files.filter((_, i) => i !== fileToDelete));
    }
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="font-h2 mb-6">Train avatar</h1>

      {/* Dialogue Section */}
      <div className="bg-card rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[24px] font-medium">Dialogue</h2>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-[14px] cursor-pointer text-white rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8]"
          >
            <Plus size={16} /> Add new
          </button>
        </div>

        {dialogues.length === 0 && !showForm && (
          <p className="text-foreground text-[14px]">
            To begin, please click on the button as no data has been added yet.
          </p>
        )}

        {/* Add Dialogue Form */}
        {showForm && (
          <div className="rounded-xl p-0 mb-4 bg-card">
            <label className="text-sm font-medium">Question</label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full mt-2 p-3 rounded-lg outline-none bg-[#F8F8F8]"
              placeholder="(example: What is your favourite cuisine?)"
            />

            <label className="text-sm font-medium mt-4 block">Answer</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full mt-2 p-3 rounded-lg bg-[#F8F8F8] outline-none"
              rows={3}
              placeholder="(example: Personally, my favourite cuisine is Italian.)"
            />

            <div className="flex justify-end gap-3 mt-4">
              <div className="p-[1px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8]">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 rounded-full bg-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={addDialogue}
                className="px-6 py-2 rounded-full text-white bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Dialogue List */}
        <div className="space-y-3">
          {dialogues.map((d) => (
            <div
              key={d.id}
              className="border border-[#EBEBEB] rounded-xl overflow-hidden"
            >
              <div
                onClick={() => toggleDialogue(d.id)}
                className="flex justify-between items-center p-4 cursor-pointer"
              >
                <p className="font-normal text-[14px]">{d.question}</p>

                {d.open ? <ChevronUp /> : <ChevronDown />}
              </div>

              {d.open && (
                <div className="p-4 border-t text-sm">
                  <p className="font-medium mb-1">Question:</p>
                  <p className="mb-3">{d.question}</p>

                  <p className="font-medium mb-1">Answer:</p>
                  <p className="">{d.answer}</p>

                  <div className="flex justify-end gap-3 mt-3">
                    <Pencil
                      size={18}
                      onClick={() => editDialogue(d)}
                      className="cursor-pointer text-gray-600"
                    />

                    <Trash2
                      size={18}
                      onClick={() => deleteDialogue(d.id)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Files Section */}
      <div className="bg-card rounded-xl p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-[24px] font-medium">Files</h2>

          <div className="inline-block p-[1px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8]">
            <label className="bg-white  px-4 py-2 rounded-full cursor-pointer block">
              Choose file
              <input
                type="file"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <p className="text-foreground text-sm mt-2 mb-4">
          Download the sample file to understand how to correctly fill it out.
        </p>

        <div className="flex uppercase gap-2 text-[#878787] mb-5">
          <div className="border-b border-[#878787]">Pdf</div>
          <div className="border-b border-[#878787]">doc</div>
          <div className="border-b border-[#878787]">xls</div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className=" rounded-lg flex gap-4 flex-wrap w-fit">
            {files.map((file, i) => (
              <div
                key={i}
                className="relative w-40 h-[110px] p-4 bg-[#F8F8F8] rounded-[16px] text-center flex items-center justify-center"
              >
                <X
                  onClick={() => {
                    setFileToDelete(i);
                    setShowDeleteModal(true);
                  }}
                  className="absolute -right-2 -top-2 cursor-pointer bg-[#EBEBEB] rounded-full p-1"
                />

                <p className="text-sm truncate">{file.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {showDeleteModal && fileToDelete !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white w-[520px] rounded-[20px] p-7 text-center relative">
            <X
              className="absolute right-6 top-6 cursor-pointer"
              onClick={() => setShowDeleteModal(false)}
            />

            <h2 className="text-[20px] font-normal my-12">
              Are you sure you want to delete this file?
            </h2>

            <p className="text-foreground text-[16px] font-medium mb-12">
              {files[fileToDelete]?.name}
            </p>

            <div className="flex justify-center gap-4">
              {/* Cancel */}
              <div className="p-[1px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8]">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 rounded-full bg-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Delete */}
              <button
                onClick={confirmDeleteFile}
                className="px-6 py-2 rounded-full text-white bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

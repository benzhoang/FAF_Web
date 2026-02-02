import React, { use, useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { userApi } from "../../../api/user.api";

const Step4Contract = ({
  selectedType,
  jobTitle,
  contractAccepted,
  setContractAccepted,
  onContinue,
  onBack,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDraftDirty, setIsDraftDirty] = useState(false);
  const [contractHtml, setContractHtml] = useState("");
  const [newClause, setNewClause] = useState("");
  const [user, setUser] = useState(null); // Placeholder for user data

  const [contractInfo, setContractInfo] = useState({
    clientName: "",
    clientEmail: "",
    clientUserId: "",
    workerName: "",
    workerEmail: "",
    workerUserId: "",
  });

  useEffect(() => {
    userApi
      .getMe()
      .then((data) => {
        setUser(data);
        setContractInfo({
          clientName:
            data.full_name ||
            "..........................................................",
          clientEmail: data.email || "....................................",
          clientUserId: String(
            data.id || "..................................................",
          ),
          workerName: "",
          workerEmail: "",
          workerUserId: "",
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  console.log("fdf", contractInfo.clientEmail?.trim());

  const defaultContractText = useMemo(() => {
    const safeJobTitle = jobTitle ? `"${jobTitle}"` : "(chưa nhập Job Title)";
    const clientName =
      contractInfo.clientName?.trim() ||
      "..........................................................";
    const clientEmail =
      contractInfo.clientEmail?.trim() ||
      "....................................";
    console.log("clientEmail:", clientEmail);
    const clientUserId =
      contractInfo.clientUserId?.trim() ||
      "..................................................";
    const workerName =
      contractInfo.workerName?.trim() ||
      "..........................................................";
    const workerEmail =
      contractInfo.workerEmail?.trim() ||
      "....................................";
    const workerUserId =
      contractInfo.workerUserId?.trim() ||
      "..................................................";
    if (selectedType === "short-term") {
      return [
        "HỢP ĐỒNG CÔNG VIỆC NGẮN HẠN (SHORT-TERM JOB CONTRACT)",
        "",
        "HỢP ĐỒNG CÔNG VIỆC NGẮN HẠN",
        "Hợp đồng này được ký kết giữa:",
        "",
        "Bên A - Người giao việc (Client):",
        `- Họ và tên: ${clientName}`,
        `- Email đăng ký trên hệ thống FAF: ${clientEmail}`,
        `- ID người dùng FAF: ${clientUserId}`,
        "",
        "Bên B - Người nhận việc (Worker):",
        `- Họ và tên: ${workerName}`,
        `- Email đăng ký trên hệ thống FAF: ${workerEmail}`,
        `- ID người dùng FAF: ${workerUserId}`,
        "",
        "Hệ thống trung gian:",
        "- Tên hệ thống: FAF Platform",
        "- Vai trò: Trung gian quản lý công việc, điểm thưởng, đánh giá và xử lý tranh chấp.",
        "",
        "Điều 1. Nội dung công việc",
        "Bên B đồng ý thực hiện công việc do Bên A đăng tải trên hệ thống FAF theo mô tả, thời hạn và số điểm thưởng đã được xác nhận.",
        `Thông tin tham chiếu: ${safeJobTitle}`,
        "",
        "Điều 2. Thời hạn và điểm thưởng",
        "- Thời hạn hoàn thành: Theo thông tin công việc trên hệ thống FAF.",
        "- Điểm thưởng: Theo công việc đã được hệ thống xác nhận và khóa điểm.",
        "",
        "Điều 3. Quyền và nghĩa vụ các bên",
        "- Bên A có quyền đánh giá kết quả công việc và xác nhận hoàn thành hoặc không hoàn thành.",
        "- Bên B có nghĩa vụ hoàn thành công việc đúng hạn và đúng yêu cầu.",
        "- FAF giữ vai trò trung gian giữ điểm, giải ngân, khóa điểm và xử lý tranh chấp.",
        "",
        "Điều 4. Vi phạm và xử lý",
        "Vi phạm hợp đồng sẽ được xử lý theo quy định của hệ thống FAF, bao gồm trừ điểm uy tín, khóa tài khoản tạm thời hoặc hoàn tiền.",
        "",
        "Điều 5. Hiệu lực hợp đồng",
        "Hợp đồng có hiệu lực kể từ thời điểm cả hai bên xác nhận (ký) và công việc được gắn trên hệ thống FAF.",
        "",
        "ĐẠI DIỆN CÁC BÊN KÝ TÊN",
        "Bên A - Người giao việc (Ký và ghi rõ họ tên)",
        "..........................................................",
        "",
        "Bên B - Người nhận việc (Ký và ghi rõ họ tên)",
        "..........................................................",
        "",
        "Ngày ...... tháng ...... năm ......",
        "",
        "Loại hợp đồng: Short-term Protected",
      ].join("\n");
    }

    // LONG-TERM
    return [
      "HỢP ĐỒNG CÔNG VIỆC DÀI HẠN (LONG-TERM JOB CONTRACT)",
      "",
      "HỢP ĐỒNG CÔNG VIỆC DÀI HẠN",
      "Hợp đồng này được ký kết giữa:",
      "",
      "Bên A - Người giao việc (Client):",
      `- Họ và tên: ${clientName}`,
      `- Email đăng ký trên hệ thống FAF: ${clientEmail}`,
      `- ID người dùng FAF: ${clientUserId}`,
      "",
      "Bên B - Người nhận việc (Worker):",
      `- Họ và tên: ${workerName}`,
      `- Email đăng ký trên hệ thống FAF: ${workerEmail}`,
      `- ID người dùng FAF: ${workerUserId}`,
      "",
      "Hệ thống FAF:",
      "- Vai trò: Nền tảng kết nối chuyên biệt giữa Bên A và Bên B; không chịu trách nhiệm trực tiếp về thanh toán.",
      "",
      "Điều 1. Nội dung và hình thức hợp tác",
      "Bên A và Bên B thống nhất thiết lập quan hệ hợp tác dài hạn, có thể bao gồm nhiều công việc/đợt cộng tác khác nhau.",
      `Thông tin tham chiếu vị trí/công việc chính: ${safeJobTitle}`,
      "",
      "Điều 2. Thời hạn và lịch làm việc",
      "- Thời hạn hợp tác: Theo thỏa thuận riêng giữa Bên A và Bên B (có thể gia hạn bằng phụ lục hợp đồng).",
      "- Lịch làm việc, khối lượng công việc và KPI được hai bên thống nhất và có thể điều chỉnh theo từng giai đoạn.",
      "",
      "Điều 3. Thù lao và phương thức thanh toán",
      "- Mức lương/thù lao, hình thức trả lương (theo giờ, theo tháng, theo dự án...) do hai bên tự thỏa thuận.",
      "- Việc thanh toán được thực hiện trực tiếp giữa Bên A và Bên B (ngoài hệ thống FAF).",
      "- FAF chỉ đóng vai trò là đơn vị kết nối, không giữ hoặc quản lý dòng tiền giữa hai bên.",
      "",
      "Điều 4. Quyền và nghĩa vụ các bên",
      "- Hai bên có trách nhiệm tôn trọng thỏa thuận, bảo mật thông tin và tuân thủ pháp luật hiện hành.",
      "- Trường hợp phát sinh tranh chấp, hai bên ưu tiên thương lượng; FAF có thể hỗ trợ cung cấp lịch sử kết nối trên hệ thống khi cần.",
      "",
      "Điều 5. Chấm dứt hợp đồng",
      "- Hợp đồng có thể chấm dứt theo thỏa thuận của hai bên hoặc theo điều kiện được quy định trong hợp đồng/ phụ lục.",
      "- Mọi nghĩa vụ thanh toán, bàn giao công việc (nếu có) sẽ do hai bên trực tiếp thực hiện.",
      "",
      "Điều 6. Hiệu lực hợp đồng",
      "Hợp đồng có hiệu lực kể từ ngày hai bên ký kết hoặc từ ngày được ghi rõ trong điều khoản riêng (nếu có).",
      "",
      "ĐẠI DIỆN CÁC BÊN KÝ TÊN",
      "Bên A - Người giao việc (Ký và ghi rõ họ tên)",
      "..........................................................",
      "",
      "Bên B - Người nhận việc (Ký và ghi rõ họ tên)",
      "..........................................................",
      "",
      "Ngày ...... tháng ...... năm ......",
      "",
      "Loại hợp đồng: Long-term Connection",
    ].join("\n");
  }, [contractInfo, jobTitle, selectedType]);

  const defaultContractHtml = useMemo(() => {
    const escapeHtml = (unsafe) =>
      unsafe
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    return defaultContractText
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "<p></p>";
        if (
          trimmed.startsWith("HỢP ĐỒNG CÔNG VIỆC") &&
          trimmed.includes("JOB CONTRACT")
        ) {
          return `<h2>${escapeHtml(trimmed)}</h2>`;
        }
        if (
          trimmed.startsWith("Điều ") ||
          trimmed === "HỢP ĐỒNG CÔNG VIỆC NGẮN HẠN" ||
          trimmed === "HỢP ĐỒNG CÔNG VIỆC DÀI HẠN"
        ) {
          return `<h3>${escapeHtml(trimmed)}</h3>`;
        }
        if (
          trimmed.startsWith("Bên A") ||
          trimmed.startsWith("Bên B") ||
          trimmed.startsWith("Hệ thống trung gian") ||
          trimmed.startsWith("Hệ thống FAF") ||
          trimmed === "ĐẠI DIỆN CÁC BÊN KÝ TÊN"
        ) {
          return `<p><strong>${escapeHtml(trimmed)}</strong></p>`;
        }
        return `<p>${escapeHtml(line)}</p>`;
      })
      .join("");
  }, [defaultContractText]);

  const isReady = !!contractInfo.clientEmail;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Image,
    ],
    content: "", // khởi tạo rỗng
    editable: isEditing,
    editorProps: {
      attributes: {
        class:
          "tiptap-content outline-none text-[13px] leading-6 text-gray-900",
      },
    },
    onUpdate: ({ editor }) => {
      setContractHtml(editor.getHTML());
      setIsDraftDirty(true);
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (isDraftDirty) return;

    editor.commands.setContent(defaultContractHtml, false);
  }, [editor, defaultContractHtml, isDraftDirty]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isEditing);
  }, [editor, isEditing]);

  const appendClauseToDraft = () => {
    const clause = newClause.trim();
    if (!clause) return;

    const escapeHtml = (unsafe) =>
      unsafe
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    setContractHtml((prev) => {
      const hasExtraSection = prev.includes("Điều khoản bổ sung:");
      const suffix = hasExtraSection
        ? `<p>- ${escapeHtml(clause)}</p>`
        : `<h3>Điều khoản bổ sung:</h3><p>- ${escapeHtml(clause)}</p>`;
      return `${prev}${suffix}`;
    });
    setIsDraftDirty(true);
    setNewClause("");
  };

  const resetToTemplate = () => {
    setContractHtml(defaultContractHtml);
    setIsDraftDirty(false);
    if (editor) editor.commands.setContent(defaultContractHtml, false);
  };

  const toolbarBtnClass = (active, disabled = false) =>
    [
      "inline-flex items-center justify-center w-9 h-9 rounded-md border transition-all duration-150",
      active
        ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
        : disabled
          ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95",
    ].join(" ");

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Nhập liên kết (URL):", previousUrl || "");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  };

  const addImage = () => {
    if (!editor) return;
    const url = window.prompt("Nhập URL ảnh:");
    if (!url || !url.trim()) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Work contract</h1>
        <p className="text-sm text-gray-600">
          Please read the contract below carefully and confirm your agreement to
          continue.{" "}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">
            {selectedType === "short-term"
              ? "SHORT-TERM JOB CONTRACT"
              : "LONG-TERM JOB CONTRACT"}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500">
              {selectedType === "short-term"
                ? "Short-term Protected"
                : "Long-term Connection"}
            </div>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    resetToTemplate();
                  }}
                  className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contract paper */}
        <div className="bg-gray-50 p-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="max-h-[70vh] overflow-auto p-8">
              {isEditing && editor && (
                <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 py-2 shadow-sm">
                  <button
                    type="button"
                    className={toolbarBtnClass(editor.isActive("bold"))}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                  >
                    <span className="text-sm font-bold">B</span>
                  </button>
                  <button
                    type="button"
                    className={toolbarBtnClass(editor.isActive("italic"))}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                  >
                    <span className="text-sm italic font-semibold">I</span>
                  </button>
                  <button
                    type="button"
                    className={toolbarBtnClass(editor.isActive("underline"))}
                    onClick={() =>
                      editor.chain().focus().toggleUnderline().run()
                    }
                    title="Underline"
                  >
                    <span className="text-sm underline font-semibold">U</span>
                  </button>

                  <div className="mx-0.5 h-6 w-px bg-gray-300" />

                  <div className="relative">
                    <select
                      value={
                        editor.isActive("heading", { level: 1 })
                          ? "h1"
                          : editor.isActive("heading", { level: 2 })
                            ? "h2"
                            : editor.isActive("heading", { level: 3 })
                              ? "h3"
                              : "p"
                      }
                      onChange={(e) => {
                        const v = e.target.value;
                        const chain = editor.chain().focus();
                        if (v === "p") chain.setParagraph().run();
                        if (v === "h1") chain.toggleHeading({ level: 1 }).run();
                        if (v === "h2") chain.toggleHeading({ level: 2 }).run();
                        if (v === "h3") chain.toggleHeading({ level: 3 }).run();
                      }}
                      className="h-9 rounded-md border border-gray-200 bg-white pl-2.5 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300 appearance-none cursor-pointer"
                    >
                      <option value="p">Normal</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="mx-0.5 h-6 w-px bg-gray-300" />

                  <button
                    type="button"
                    className={toolbarBtnClass(editor.isActive("bulletList"))}
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    title="Bullet list"
                  >
                    <span className="text-base font-bold">•</span>
                  </button>
                  <button
                    type="button"
                    className={toolbarBtnClass(editor.isActive("orderedList"))}
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    title="Numbered list"
                  >
                    <span className="text-sm font-semibold">1.</span>
                  </button>

                  <div className="mx-0.5 h-6 w-px bg-gray-300" />

                  <button
                    type="button"
                    className={toolbarBtnClass(editor.isActive("link"))}
                    onClick={setLink}
                    title="Insert link"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={toolbarBtnClass(false)}
                    onClick={addImage}
                    title="Insert image"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <div className="mx-0.5 h-6 w-px bg-gray-300" />

                  <button
                    type="button"
                    className={toolbarBtnClass(false, !editor.can().undo())}
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={toolbarBtnClass(false, !editor.can().redo())}
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {!isEditing ? (
                <div
                  className="tiptap-content text-[13px] leading-6 text-gray-900"
                  dangerouslySetInnerHTML={{
                    __html: contractHtml || defaultContractHtml,
                  }}
                />
              ) : (
                <div className="min-h-[60vh] rounded-lg border border-gray-200 bg-white p-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-600/20">
                  <EditorContent editor={editor} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acceptance + actions */}
        <div className="px-6 py-5 border-t border-gray-100">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={contractAccepted}
              onChange={(e) => setContractAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I have read and agree to the terms in this contract.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button
              onClick={() => {
                const finalContractHtml = contractHtml || defaultContractHtml;
                onContinue(finalContractHtml);
              }}
              disabled={!contractAccepted}
              className={`sm:order-2 w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold shadow-md transition-colors ${
                contractAccepted
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
            <button
              onClick={onBack}
              className="sm:order-1 w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← Back to Step 3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Contract;

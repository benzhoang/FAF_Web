import React, { use, useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { userApi } from "../../../api/user.api";
import { useTranslation } from "react-i18next";

const Step4Contract = ({
  selectedType,
  jobTitle,
  contractAccepted,
  setContractAccepted,
  onContinue,
  onBack,
  hideFooter = false,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isDraftDirty, setIsDraftDirty] = useState(false);
  const [contractHtml, setContractHtml] = useState("");
  const [newClause, setNewClause] = useState("");
  const [user, setUser] = useState(null);

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
          clientName: data.full_name || "..........................................................",
          clientEmail: data.email || "....................................",
          clientUserId: String(data.id || ".................................................."),
          workerName: "",
          workerEmail: "",
          workerUserId: "",
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const defaultContractText = useMemo(() => {
    const safeJobTitle = jobTitle ? `"${jobTitle}"` : "(EMPTY_MISSION_ID)";
    const clientName = contractInfo.clientName?.trim() || "..........................................................";
    const clientEmail = contractInfo.clientEmail?.trim() || "....................................";
    const clientUserId = contractInfo.clientUserId?.trim() || "..................................................";
    const workerName = contractInfo.workerName?.trim() || "..........................................................";
    const workerEmail = contractInfo.workerEmail?.trim() || "....................................";
    const workerUserId = contractInfo.workerUserId?.trim() || "..................................................";
    
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
    const escapeHtml = (unsafe) => unsafe.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

    return defaultContractText
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "<p></p>";
        if (trimmed.startsWith("HỢP ĐỒNG CÔNG VIỆC") && trimmed.includes("JOB CONTRACT")) return `<h2>${escapeHtml(trimmed)}</h2>`;
        if (trimmed.startsWith("Điều ") || trimmed === "HỢP ĐỒNG CÔNG VIỆC NGẮN HẠN" || trimmed === "HỢP ĐỒNG CÔNG VIỆC DÀI HẠN") return `<h3>${escapeHtml(trimmed)}</h3>`;
        if (trimmed.startsWith("Bên A") || trimmed.startsWith("Bên B") || trimmed.startsWith("Hệ thống trung gian") || trimmed.startsWith("Hệ thống FAF") || trimmed === "ĐẠI DIỆN CÁC BÊN KÝ TÊN") return `<p><strong>${escapeHtml(trimmed)}</strong></p>`;
        return `<p>${escapeHtml(line)}</p>`;
      })
      .join("");
  }, [defaultContractText]);

  const { lockedHtml, editableHtml } = useMemo(() => {
    const html = defaultContractHtml;
    const signatureIndex = html.indexOf('<p><strong>ĐẠI DIỆN CÁC BÊN KÝ TÊN</strong></p>');

    if (signatureIndex !== -1) {
      return { lockedHtml: html.substring(0, signatureIndex), editableHtml: html.substring(signatureIndex) };
    }

    const endOfLockedPattern = selectedType === "short-term" ? /(<h3>Điều 5\. Hiệu lực hợp đồng<\/h3>[\s\S]*?<p><\/p>)/i : /(<h3>Điều 6\. Hiệu lực hợp đồng<\/h3>[\s\S]*?<p><\/p>)/i;
    const match = html.match(endOfLockedPattern);

    if (match && match.index !== undefined) {
      const endIndex = match.index + match[0].length;
      return { lockedHtml: html.substring(0, endIndex), editableHtml: html.substring(endIndex) };
    }
    return { lockedHtml: html, editableHtml: "" };
  }, [defaultContractHtml, selectedType]);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }), Image],
    content: "",
    editable: isEditing,
    editorProps: {
      attributes: {
        class: "tiptap-content outline-none text-[13px] leading-6 text-slate-300 font-mono",
      },
    },
    onUpdate: ({ editor }) => {
      setContractHtml(editor.getHTML());
      setIsDraftDirty(true);
    },
  });

  useEffect(() => {
    if (!editor || isDraftDirty) return;
    editor.commands.setContent(contractHtml || editableHtml, false);
  }, [editor, editableHtml, isDraftDirty, contractHtml]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isEditing);
  }, [editor, isEditing]);

  const resetToTemplate = () => {
    setContractHtml("");
    setIsDraftDirty(false);
    if (editor) editor.commands.setContent(editableHtml, false);
  };

  const toolbarBtnClass = (active, disabled = false) =>
    [
      "inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-150",
      active
        ? "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.2)]"
        : disabled
          ? "border-white/5 bg-transparent text-slate-700 cursor-not-allowed"
          : "border-white/10 bg-black/20 text-slate-400 hover:bg-white/5 hover:border-white/20 active:scale-95",
    ].join(" ");

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl || "");
    if (url === null) return;
    if (url.trim() === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const addImage = () => {
    if (!editor) return;
    const url = window.prompt("Enter Image URL:");
    if (!url || !url.trim()) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="border-b border-white/5 pb-8 mb-10">
        <p className="text-[10px] font-mono font-black text-fuchsia-500 uppercase tracking-[0.3em] mb-2">{t('postjob.step4_subtitle', 'LEGAL_ENCRYPTION')}</p>
        <h1 className="text-3xl font-black text-white uppercase tracking-wider font-mono">{t('postjob.step4_title', 'MISSION_PROTOCOL_CONTRACT')}</h1>
      </div>

      <div className="bg-[#090e17]/80 backdrop-blur-md border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] pointer-events-none z-20" />
        
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01] relative z-10">
          <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] font-mono">
                {selectedType === "short-term" ? t('postjob.st_contract_title') : t('postjob.lt_contract_title')}
              </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest hidden sm:block">
              HASH_TYPE: <span className="text-slate-400">{selectedType.toUpperCase()}</span>
            </div>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="group px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black text-slate-300 hover:text-white hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 transition-all font-mono tracking-widest uppercase"
              >
                {t('postjob.btn_edit', 'MODIFY_PROTOCOL')}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-fuchsia-600 text-[#020617] text-[10px] font-black hover:bg-fuchsia-500 transition-all font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                >
                  {t('postjob.btn_save', 'COMMIT_CHANGES')}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); resetToTemplate(); }}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-transparent text-[10px] font-black text-slate-500 hover:text-white transition-all font-mono tracking-widest uppercase"
                >
                  {t('postjob.btn_cancel', 'REVERT')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contract area */}
        <div className="bg-black/40 p-1 relative z-10">
          <div className="bg-transparent/50 p-8 sm:p-12 relative">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-fuchsia-500/30 -translate-x-1 -translate-y-1" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-fuchsia-500/30 translate-x-1 -translate-y-1" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-fuchsia-500/30 -translate-x-1 translate-y-1" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-fuchsia-500/30 translate-x-1 translate-y-1" />

            {isEditing && editor && (
              <div className="mb-8 flex flex-wrap items-center gap-2 rounded-2xl border border-white/5 bg-black/40 px-4 py-3 shadow-inner">
                <button type="button" className={toolbarBtnClass(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
                <button type="button" className={toolbarBtnClass(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
                <button type="button" className={toolbarBtnClass(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
                <div className="mx-1 h-6 w-px bg-white/5" />
                <select
                  value={editor.isActive("heading", { level: 1 }) ? "h1" : editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : "p"}
                  onChange={(e) => {
                    const v = e.target.value;
                    const chain = editor.chain().focus();
                    if (v === "p") chain.setParagraph().run();
                    else chain.toggleHeading({ level: parseInt(v.at(1)) }).run();
                  }}
                  className="h-8 rounded-lg border border-white/10 bg-black/20 px-3 text-[10px] font-black text-slate-400 font-mono outline-none focus:border-fuchsia-500/30 appearance-none uppercase cursor-pointer"
                >
                  <option value="p" className="bg-[#0f172a]">PARA</option>
                  <option value="h1" className="bg-[#0f172a]">HDR_01</option>
                  <option value="h2" className="bg-[#0f172a]">HDR_02</option>
                  <option value="h3" className="bg-[#0f172a]">HDR_03</option>
                </select>
                <div className="mx-1 h-6 w-px bg-white/5" />
                <button type="button" className={toolbarBtnClass(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>•</button>
                <button type="button" className={toolbarBtnClass(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
                <div className="mx-1 h-6 w-px bg-white/5" />
                <button type="button" className={toolbarBtnClass(editor.isActive("link"))} onClick={setLink}>🔗</button>
                <button type="button" className={toolbarBtnClass(false)} onClick={addImage}>🖼️</button>
                <div className="mx-1 h-6 w-px bg-white/5" />
                <button type="button" className={toolbarBtnClass(false, !editor.can().undo())} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>⟲</button>
                <button type="button" className={toolbarBtnClass(false, !editor.can().redo())} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>⟳</button>
              </div>
            )}

            <div className="max-h-[60vh] overflow-y-auto custom-contract-scrollbar pr-4">
                <style dangerouslySetInnerHTML={{ __html: `
                  .custom-contract-scrollbar::-webkit-scrollbar { width: 4px; }
                  .custom-contract-scrollbar::-webkit-scrollbar-track { background: transparent; }
                  .custom-contract-scrollbar::-webkit-scrollbar-thumb { background: rgba(217, 70, 239, 0.1); border-radius: 10px; }
                  .custom-contract-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(217, 70, 239, 0.3); }
                  
                  .tiptap-content h2 { color: white; font-size: 1.2rem; font-weight: 900; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
                  .tiptap-content h3 { color: #d946ef; font-size: 0.9rem; font-weight: 900; margin-top: 2rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.2em; }
                  .tiptap-content p { margin-bottom: 1rem; color: #94a3b8; font-size: 0.8rem; line-height: 1.6; }
                  .tiptap-content strong { color: #f8fafc; font-weight: 700; }
                  .locked-content { opacity: 0.7; border-left: 2px solid rgba(217,70,239,0.2); padding-left: 1rem; margin-bottom: 2rem; }
                `}} />

                {!isEditing ? (
                  <div
                    className="tiptap-content"
                    dangerouslySetInnerHTML={{ __html: lockedHtml + (contractHtml || editableHtml) }}
                  />
                ) : (
                  <div className="tiptap-content">
                    <div className="locked-content" dangerouslySetInnerHTML={{ __html: lockedHtml }} />
                    <div className="editable-section mt-8 p-6 bg-white/[0.02] border border-fuchsia-500/20 rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.05)]">
                        <p className="text-[9px] font-black text-fuchsia-500 uppercase tracking-widest mb-4 italic opacity-50">// EDITABLE_BUFFER_ACTIVE</p>
                        <EditorContent editor={editor} />
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {!hideFooter && (
          <div className="px-8 py-8 border-t border-white/5 bg-white/[0.01] relative z-10">
            <label className="flex items-center gap-4 cursor-pointer select-none group max-w-2xl">
              <div className="relative">
                  <input
                    type="checkbox"
                    checked={contractAccepted}
                    onChange={(e) => setContractAccepted(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-white/10 bg-black/40 rounded flex items-center justify-center transition-all peer-checked:border-fuchsia-500 peer-checked:bg-fuchsia-500/20 shadow-inner" />
                  <svg className="absolute w-3 h-3 text-fuchsia-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
              </div>
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-500 group-hover:text-slate-300 transition-colors italic">
                {t('postjob.contract_agree', 'I_ACKNOWLEDGE_PROTOCOL_LEGAL_TERMS_AND_FAF_ESCROW_GOVERNANCE.')}
              </span>
            </label>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-white/5">
              <button
                onClick={() => onContinue(lockedHtml + (contractHtml || editableHtml))}
                disabled={!contractAccepted}
                className={`group relative overflow-hidden sm:order-2 px-10 py-4 rounded-xl text-[11px] font-black font-mono tracking-[0.2em] uppercase transition-all active:scale-[0.98] ${
                    contractAccepted
                    ? "bg-fuchsia-600 text-[#020617] shadow-[0_0_25px_rgba(217,70,239,0.3)] hover:bg-fuchsia-500"
                    : "bg-white/5 text-slate-700 cursor-not-allowed border border-white/5"
                  }`}
              >
                <span className="relative z-10">{t('postjob.btn_continue', 'COMMIT_TO_MAINFRAME')}</span>
                {contractAccepted && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />}
              </button>
              
              <button
                onClick={onBack}
                className="sm:order-1 px-10 py-4 rounded-xl text-[11px] font-black font-mono tracking-[0.2em] uppercase border border-white/10 text-slate-500 hover:text-white hover:border-white/20 transition-all active:scale-[0.98]"
              >
                {t('postjob.btn_back_step3', '<< RECONFIGURE_BUDGET')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4Contract;

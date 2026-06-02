/**
 * Document Form Styling Constants
 * 
 * Provides consistent, professional styling for document-style form fields
 * that resembles official application documents.
 */

// Input field styling - clean, minimal with subtle underline effect
export const documentInputStyles =
  "w-full border-b-2 border-[var(--color-line)] bg-transparent px-0 py-2 text-sm font-normal text-[var(--color-navy)] outline-none placeholder:text-[var(--color-navy-soft)] transition-colors focus:border-b-[var(--color-gold)] focus:ring-0";

// File input styling - document-style upload fields
export const documentFileInputStyles =
  "w-full border border-[var(--color-line)] rounded-lg bg-white px-3 py-2 text-sm text-[var(--color-navy)] outline-none file:mr-3 file:border-0 file:bg-[var(--color-navy)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-[rgba(17,32,49,0.92)] focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[rgba(179,135,64,0.2)] transition-colors";

// Textarea styling - matches input fields
export const documentTextareaStyles =
  "w-full border-b-2 border-[var(--color-line)] bg-transparent px-0 py-2 text-sm font-normal text-[var(--color-navy)] outline-none placeholder:text-[var(--color-navy-soft)] transition-colors focus:border-b-[var(--color-gold)] focus:ring-0 resize-none";

// Select styling - matches other form fields
export const documentSelectStyles =
  "w-full border-b-2 border-[var(--color-line)] bg-transparent px-0 py-2 text-sm font-normal text-[var(--color-navy)] outline-none placeholder:text-[var(--color-navy-soft)] transition-colors focus:border-b-[var(--color-gold)] focus:ring-0 appearance-none cursor-pointer pr-5";

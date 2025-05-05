"use client"

import { X } from "lucide-react"

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP: cubre todo, no intercepta clicks */}
      <div className="fixed inset-0 bg-gray-500 opacity-75 pointer-events-none" />

      {/* CENTRADO */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* PANEL: intercepta clicks */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-lg pointer-events-auto">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6">{message}</p>

            <div className="flex justify-end">
              <button
                onClick={onCancel}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

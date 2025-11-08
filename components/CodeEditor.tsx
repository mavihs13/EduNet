'use client'

import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  placeholder?: string
  readOnly?: boolean
}

export default function CodeEditor({ 
  value, 
  onChange, 
  language, 
  placeholder = '',
  readOnly = false 
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const getLanguageExtension = () => {
      switch (language) {
        case 'python':
          return python()
        case 'javascript':
        case 'typescript':
        default:
          return javascript()
      }
    }

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        getLanguageExtension(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !readOnly) {
            onChange(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          '&': {
            fontSize: '14px',
          },
          '.cm-content': {
            padding: '12px',
            minHeight: '120px',
          },
          '.cm-focused': {
            outline: 'none',
          },
        }),
        EditorState.readOnly.of(readOnly),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      if (view) {
        view.destroy()
      }
    }
  }, [language, readOnly, placeholder])

  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString()
      if (currentValue !== value) {
        try {
          viewRef.current.dispatch({
            changes: {
              from: 0,
              to: viewRef.current.state.doc.length,
              insert: value || '',
            },
          })
        } catch (error) {
          console.error('Error updating CodeMirror:', error)
        }
      }
    }
  }, [value])

  return <div ref={editorRef} className="border rounded" />
}
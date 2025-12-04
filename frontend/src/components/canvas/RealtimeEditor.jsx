import React, { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import collaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// Define your YJS provider endpoint
const YJS_ENDPOINT = 'ws://localhost:1234'; // Replace with your actual YJS endpoint

const RealtimeEditor = ({ documentId }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: new Y.Doc(), // This will be replaced by the shared Yjs document
      }),
      collaborationCursor({
        provider: null, // This will be replaced by the shared provider
        userColorGetter: (user) => {
          // You can customize user colors here, e.g., based on user ID or fetch from an API
          const colors = ['#99c9ff', '#ffc999', '#99ffc9', '#ff99c9', '#c999ff', '#99ffff'];
          return colors[user.id % colors.length];
        },
      }),
    ],
    content: '', // Initial content can be empty or fetched from somewhere
  });

  const yDocRef = useRef(null);
  const providerRef = useRef(null);

  useEffect(() => {
    if (!editor) return;

    // Initialize Yjs Document and Provider
    yDocRef.current = new Y.Doc();
    providerRef.current = new WebsocketProvider(YJS_ENDPOINT, documentId, yDocRef.current);

    // Get the shared Yjs text type
    const yText = yDocRef.current.getText('tiptap');

    // Configure Tiptap's Collaboration extension with the shared document
    editor.chain().focus().setCollaborationDocument(yDocRef.current).run();
    editor.chain().focus().setCollaborationCursor({ provider: providerRef.current }).run();

    // Load initial content if it exists or is fetched
    // You might want to fetch initial content from a backend if this is a new document
    // For demonstration, we'll assume an empty doc or you can populate yText directly
    if (yText.length === 0) {
      // Example: yText.insert(0, 'Start typing collaboratively!');
    }

    // Clean up on unmount
    return () => {
      if (providerRef.current) {
        providerRef.current.destroy();
      }
    };
  }, [editor, documentId]);

  // Optionally, handle user name/color for collaboration cursor
  useEffect(() => {
    if (editor && providerRef.current) {
      const userName = prompt('Enter your name:'); // Simple prompt for user name
      if (userName) {
        // Set the user's name for the collaboration cursor
        providerRef.current.awareness.setLocalStateField('user', {
          name: userName,
          color: '#ffcc00', // Example color, can be randomized or fetched
        });
      }
    }
  }, [editor, providerRef.current]);


  if (!editor) {
    return null;
  }

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RealtimeEditor;

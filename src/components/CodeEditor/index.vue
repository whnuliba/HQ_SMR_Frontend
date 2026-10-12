<template>
  <div ref="editorRef" class="code-editor"></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import { EditorState } from '@codemirror/state';
  import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, highlightActiveLine } from '@codemirror/view';
  import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
  import { json } from '@codemirror/lang-json';
  import { oneDark } from '@codemirror/theme-one-dark';
  import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter } from '@codemirror/language';
  import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';

  const props = defineProps<{
    modelValue?: string;
    readonly?: boolean;
    height?: string;
  }>();

  const emit = defineEmits(['update:modelValue']);

  const editorRef = ref<HTMLElement | null>(null);
  let editorView: EditorView | null = null;

  onMounted(() => {
    if (editorRef.value) {
      const startState = EditorState.create({
        doc: props.modelValue || '',
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          history(),
          foldGutter(),
          drawSelection(),
          EditorState.allowMultipleSelections.of(true),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          bracketMatching(),
          closeBrackets(),
          highlightActiveLine(),
          keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
          json(),
          oneDark,
          EditorView.lineWrapping,
          EditorState.readOnly.of(props.readonly ?? true),
          EditorView.theme({
            '&': {
              height: props.height || '300px',
              fontSize: '13px',
            },
            '.cm-scroller': {
              overflow: 'auto',
              fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
            },
          }),
        ],
      });

      editorView = new EditorView({
        state: startState,
        parent: editorRef.value,
      });
    }
  });

  watch(() => props.modelValue, (newValue) => {
    if (editorView) {
      const currentValue = editorView.state.doc.toString();
      if (newValue !== currentValue) {
        editorView.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: newValue || '',
          },
        });
      }
    }
  });

  onUnmounted(() => {
    editorView?.destroy();
  });

  function getValue(): string {
    return editorView?.state.doc.toString() || '';
  }

  defineExpose({
    getValue,
  });
</script>

<style scoped>
  .code-editor {
    border: 1px solid #333;
    border-radius: 4px;
    overflow: hidden;
  }
</style>

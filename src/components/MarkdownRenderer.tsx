import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple custom parser to avoid complex module integration issues
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockLines: string[] = [];
    
    let listItems: string[] = [];
    
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const flushTable = (key: number) => {
      if (tableRows.length > 0 || tableHeaders.length > 0) {
        elements.push(
          <div key={`table-wrapper-${key}`} className="overflow-x-auto mb-4 border border-border-dark rounded-lg">
            <table className="min-w-full divide-y divide-border-dark text-left text-sm">
              <thead className="bg-secondary/20">
                <tr>
                  {tableHeaders.map((header, idx) => (
                    <th key={idx} className="px-4 py-3 font-semibold text-white border-r border-border-dark last:border-r-0">
                      {header.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark bg-secondary/5">
                {tableRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-secondary/10 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-2 text-slate-300 border-r border-border-dark last:border-r-0" dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableHeaders = [];
        tableRows = [];
        inTable = false;
      }
    };

    const formatInline = (str: string): string => {
      let html = str;
      // Bold
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Inline code
      html = html.replace(/`(.*?)`/g, '<code class="bg-secondary/50 text-accent px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
      // Simple links
      html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline hover:text-accent-hover">$1</a>');
      return html;
    };

    lines.forEach((line, index) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="bg-[#060913] text-slate-300 border border-border-dark p-4 rounded-xl overflow-x-auto font-mono text-xs mb-4">
              <code>{codeBlockLines.join('\n')}</code>
            </pre>
          );
          codeBlockLines = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        flushList(index);
        flushTable(index);
        elements.push(
          <h1 key={index} className="text-2xl md:text-3xl font-extrabold text-white mt-6 mb-4 border-b border-border-dark pb-2">
            {line.replace('# ', '')}
          </h1>
        );
        return;
      }
      if (line.startsWith('## ')) {
        flushList(index);
        flushTable(index);
        elements.push(
          <h2 key={index} className="text-xl md:text-2xl font-bold text-slate-100 mt-5 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        flushList(index);
        flushTable(index);
        elements.push(
          <h3 key={index} className="text-lg md:text-xl font-bold text-slate-200 mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Horizontal Rule
      if (line.trim() === '---') {
        flushList(index);
        flushTable(index);
        elements.push(<hr key={index} className="border-border-dark my-5" />);
        return;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        flushList(index);
        flushTable(index);
        elements.push(
          <blockquote key={index} className="border-l-4 border-accent bg-accent-light text-slate-300 pl-4 py-2 pr-2 rounded-r-lg mb-4 italic text-sm">
            {line.replace('> ', '')}
          </blockquote>
        );
        return;
      }

      // Bullet lists
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        flushTable(index);
        listItems.push(line.replace(/^(\s*[\*\-]\s)/, ''));
        return;
      }

      // Table lines
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        flushList(index);
        const parts = line.split('|').map(s => s.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
        
        // Check if divider line (e.g. |---|:---|)
        const isDivider = parts.every(p => p.startsWith(':') || p.startsWith('-') || p.endsWith('-'));
        
        if (isDivider) {
          inTable = true;
          return;
        }

        if (!inTable) {
          tableHeaders = parts;
          inTable = true;
        } else {
          tableRows.push(parts);
        }
        return;
      }

      // Normal paragraphs
      if (line.trim() !== '') {
        flushList(index);
        flushTable(index);
        elements.push(
          <p
            key={index}
            className="text-slate-300 leading-relaxed mb-4 text-sm md:text-base font-normal"
            dangerouslySetInnerHTML={{ __html: formatInline(line) }}
          />
        );
      } else {
        // Empty line flushes pending lists or tables
        flushList(index);
        flushTable(index);
      }
    });

    // Final flushes
    flushList(lines.length);
    flushTable(lines.length);

    return elements;
  };

  return <div className="sop-markdown font-sans">{parseMarkdown(content)}</div>;
};

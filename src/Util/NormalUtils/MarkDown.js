import React                from 'react';
import ReactMarkdown        from 'react-markdown';
import remarkMath           from 'remark-math';
import rehypeKatex          from 'rehype-katex';
import 'katex/dist/katex.min.css';

const MarkdownWithMath = ({ content }) => {
    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[
                    [rehypeKatex, {
                        // 让 KaTeX 遇到非法字符时不警告不报错
                        strict: 'ignore',
                        trust: true,
                        throwOnError: false, // 遇到解析错误时不抛出异常，继续渲染
                        errorColor: '#cc0000'
                    }]
                ]}
                components={{
                    p: ({ children }) => <p style={{ margin: '0.5em 0' }}>{children}</p>,
                    li: ({ children }) => <li style={{ marginLeft: '1.2em' }}>{children}</li>
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownWithMath;
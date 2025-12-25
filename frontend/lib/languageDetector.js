// Simple language detection for code blocks
// Detects programming language based on syntax patterns

export function detectLanguage(code) {
    if (!code || code.trim().length === 0) {
        return 'text';
    }

    const trimmedCode = code.trim();

    // Python - check for common Python patterns
    if (/^(import |from .* import|def |class |if __name__|print\(|@\w+\n)/m.test(trimmedCode)) {
        return 'python';
    }

    // Java - check for Java patterns
    if (/^(public class|private class|package |import java\.|public static void main)/m.test(trimmedCode)) {
        return 'java';
    }

    // JavaScript/TypeScript - check for JS patterns
    if (/^(const |let |var |function |import .* from|export |=>|console\.log)/m.test(trimmedCode)) {
        if (/: \w+(\[\])?[,;]|interface |type \w+ =/.test(trimmedCode)) {
            return 'typescript';
        }
        return 'javascript';
    }

    // C++ - check for C++ patterns
    if (/#include <|using namespace|std::|cout <<|cin >>/.test(trimmedCode)) {
        return 'cpp';
    }

    // C - check for C patterns
    if (/#include <stdio\.h>|#include <stdlib\.h>|printf\(|scanf\(/.test(trimmedCode)) {
        return 'c';
    }

    // C# - check for C# patterns
    if (/^(using System|namespace |public class.*\n.*{|Console\.WriteLine)/m.test(trimmedCode)) {
        return 'csharp';
    }

    // Ruby - check for Ruby patterns
    if (/^(require |def |class |module |puts |end$)/m.test(trimmedCode)) {
        return 'ruby';
    }

    // PHP - check for PHP patterns
    if (/^<\?php|^\$\w+\s*=|echo |function \w+\(/.test(trimmedCode)) {
        return 'php';
    }

    // Go - check for Go patterns
    if (/^package |^import \(|func |:=|fmt\.Print/.test(trimmedCode)) {
        return 'go';
    }

    // Rust - check for Rust patterns
    if (/^use |fn |let mut|println!|impl |struct /.test(trimmedCode)) {
        return 'rust';
    }

    // Swift - check for Swift patterns
    if (/^import |func |var |let |print\(|class.*:/.test(trimmedCode)) {
        return 'swift';
    }

    // Kotlin - check for Kotlin patterns
    if (/^fun |val |var |class |object |println\(/.test(trimmedCode)) {
        return 'kotlin';
    }

    // SQL - check for SQL patterns
    if (/^(SELECT |INSERT |UPDATE |DELETE |CREATE |DROP |ALTER )/i.test(trimmedCode)) {
        return 'sql';
    }

    // Bash/Shell - check for shell patterns
    if (/^#!\/bin\/(bash|sh)|^\w+=|echo |if \[|for \w+ in/.test(trimmedCode)) {
        return 'bash';
    }

    // HTML - check for HTML patterns
    if (/<(!DOCTYPE html|html|head|body|div|span|p|a|img)/.test(trimmedCode)) {
        return 'html';
    }

    // CSS - check for CSS patterns
    if (/\{[^}]*[a-z-]+:\s*[^;]+;/.test(trimmedCode) && !/function|const|let|var/.test(trimmedCode)) {
        return 'css';
    }

    // JSON - check for JSON patterns
    if (/^\s*[\[{]/.test(trimmedCode) && /[}\]]\s*$/.test(trimmedCode)) {
        try {
            JSON.parse(trimmedCode);
            return 'json';
        } catch (e) {
            // Not valid JSON
        }
    }

    // Default to text if no pattern matches
    return 'text';
}

// Get a confidence score for the detection (0-100)
export function getDetectionConfidence(code, detectedLang) {
    if (!code || detectedLang === 'text') {
        return 0;
    }

    // Simple confidence based on number of matching patterns
    const patterns = {
        python: [/import /, /def /, /class /, /print\(/, /__name__/],
        javascript: [/const /, /let /, /var /, /function /, /=>/],
        java: [/public /, /class /, /void /, /static/, /System\./],
        cpp: [/#include/, /using namespace/, /std::/, /cout/],
        // Add more patterns as needed
    };

    const langPatterns = patterns[detectedLang] || [];
    const matches = langPatterns.filter(pattern => pattern.test(code)).length;

    return Math.min(100, (matches / Math.max(langPatterns.length, 1)) * 100);
}

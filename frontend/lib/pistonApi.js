// Piston API service for code execution
// Supports 40+ programming languages

const PISTON_API = 'https://emkc.org/api/v2/piston';

// Language mappings for Piston API
const LANGUAGE_VERSIONS = {
    javascript: { language: 'javascript', version: '18.15.0' },
    python: { language: 'python', version: '3.10.0' },
    java: { language: 'java', version: '15.0.2' },
    cpp: { language: 'c++', version: '10.2.0' },
    c: { language: 'c', version: '10.2.0' },
    typescript: { language: 'typescript', version: '5.0.3' },
    ruby: { language: 'ruby', version: '3.0.1' },
    go: { language: 'go', version: '1.16.2' },
    rust: { language: 'rust', version: '1.68.2' },
    php: { language: 'php', version: '8.2.3' },
    csharp: { language: 'csharp', version: '6.12.0' },
    swift: { language: 'swift', version: '5.3.3' },
    kotlin: { language: 'kotlin', version: '1.8.20' },
    r: { language: 'r', version: '4.1.1' },
    bash: { language: 'bash', version: '5.2.0' }
};

export async function executeCode(code, language) {
    try {
        const langConfig = LANGUAGE_VERSIONS[language.toLowerCase()];

        if (!langConfig) {
            return {
                success: false,
                error: `Language "${language}" is not supported for execution. Supported languages: ${Object.keys(LANGUAGE_VERSIONS).join(', ')}`
            };
        }

        const response = await fetch(`${PISTON_API}/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: langConfig.language,
                version: langConfig.version,
                files: [
                    {
                        name: `main.${getFileExtension(language)}`,
                        content: code
                    }
                ],
                stdin: '',
                args: [],
                compile_timeout: 10000,
                run_timeout: 3000,
                compile_memory_limit: -1,
                run_memory_limit: -1
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.compile && result.compile.code !== 0) {
            return {
                success: false,
                error: result.compile.stderr || result.compile.output || 'Compilation failed'
            };
        }

        if (result.run) {
            return {
                success: result.run.code === 0,
                output: result.run.stdout || result.run.output || '',
                error: result.run.stderr || (result.run.code !== 0 ? 'Runtime error' : null)
            };
        }

        return {
            success: false,
            error: 'Unknown error occurred'
        };

    } catch (error) {
        return {
            success: false,
            error: `Execution failed: ${error.message}`
        };
    }
}

function getFileExtension(language) {
    const extensions = {
        javascript: 'js',
        python: 'py',
        java: 'java',
        cpp: 'cpp',
        c: 'c',
        typescript: 'ts',
        ruby: 'rb',
        go: 'go',
        rust: 'rs',
        php: 'php',
        csharp: 'cs',
        swift: 'swift',
        kotlin: 'kt',
        r: 'r',
        bash: 'sh'
    };
    return extensions[language.toLowerCase()] || 'txt';
}

// Get list of supported languages
export function getSupportedLanguages() {
    return Object.keys(LANGUAGE_VERSIONS);
}

// Check if a language is supported
export function isLanguageSupported(language) {
    return language.toLowerCase() in LANGUAGE_VERSIONS;
}

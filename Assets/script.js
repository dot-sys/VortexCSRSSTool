/*
 * MIT License
 * 
 * Copyright (c) 2025 dot-sys (https://github.com/dot-sys)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

document.addEventListener('DOMContentLoaded', function() {
    VANTA.FOG({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        highlightColor: 0x0,
        midtoneColor: 0x313131,
        lowlightColor: 0x0,
        baseColor: 0x0,
        blurFactor: 0.60,
        speed: 0.90,
        zoom: 1.80
    });

    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const csrss1Input = document.getElementById('input-csrss1');
    const csrss2Input = document.getElementById('input-csrss2');
    const indicator1 = document.getElementById('indicator-csrss1');
    const indicator2 = document.getElementById('indicator-csrss2');
    const createButton = document.getElementById('create-button');
    const resetButton = document.getElementById('reset-button');
    const outputSelect = document.getElementById('output-select');
    const outputContent = document.getElementById('output');
    const ignoreSystemCheckbox = document.getElementById('ignore-system');
    const countIndicator = document.getElementById('count-indicator');

    const WIN_PATH_REGEX = /[a-zA-Z]:\\(?:[^\\\/:\*\?<>\|"\r\n]+\\)*[^\\\/:\*\?<>\|"\r\n]+/g;
    const STANDARD_EXTENSIONS = ['exe', 'pyd', 'manifest', 'dll', 'config', 'cpl'];
    const SYSTEM_PATHS = [
        '\\WINDOWS\\system32\\',
        '\\WINDOWS\\SysWOW64\\',
        '\\Windows\\SystemApps\\',
        '\\WINDOWS\\WinSxS\\',
        '\\WINDOWS\\uus\\packages\\',
        '\\WINDOWS\\SystemTemp\\'
    ];

    function switchTab(tabId) {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    function updateIndicator(input, indicator) {
        indicator.classList.toggle('active', input.value.trim() !== '');
    }

    function updateCountIndicator(count) {
        countIndicator.textContent = `${count} strings`;
        countIndicator.style.display = count > 0 ? 'block' : 'none';
    }

    function cleanPath(path) {
        const lastDotIndex = path.lastIndexOf('.');
        if (lastDotIndex === -1) return path;
        
        const beforeDot = path.substring(0, lastDotIndex);
        const afterDot = path.substring(lastDotIndex + 1);
        
        const extension = afterDot.substring(0, 3);
        return beforeDot + '.' + extension;
    }

    function extractPaths(data, ignoreSystem) {
        const paths = [];
        data.split('\n').forEach(line => {
            if (!line.trim()) return;
            const matches = line.match(WIN_PATH_REGEX);
            if (matches) {
                matches.forEach(match => {
                    const cleanedPath = cleanPath(match);
                    const lastDotIndex = cleanedPath.lastIndexOf('.');
                    if (lastDotIndex === -1) return;
                    
                    if (ignoreSystem && isSystemPath(cleanedPath)) return;
                    paths.push(cleanedPath);
                });
            }
        });
        return paths;
    }

    function isSystemPath(path) {
        const upperPath = path.toUpperCase();
        return SYSTEM_PATHS.some(systemPath => upperPath.includes(systemPath.toUpperCase()));
    }

    function sortPaths(paths) {
        return [...new Set(paths)].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    }

    function filterByExtension(paths, extension) {
        return sortPaths(paths.filter(path => path.toLowerCase().endsWith(extension)));
    }

    function findPairs(paths) {
        const uniquePaths = [...new Set(paths)];
        const pathGroups = {};

        uniquePaths.forEach(path => {
            const lastBackslash = path.lastIndexOf('\\');
            if (lastBackslash === -1) return;

            const dirPath = path.substring(0, lastBackslash);
            const fullFilename = path.substring(lastBackslash + 1);
            const lastDot = fullFilename.lastIndexOf('.');
            const baseName = lastDot !== -1 ? fullFilename.substring(0, lastDot) : fullFilename;
            const groupKey = `${dirPath}\\${baseName}`;

            if (!pathGroups[groupKey]) pathGroups[groupKey] = [];
            pathGroups[groupKey].push(path);
        });

        const pairGroups = Object.values(pathGroups)
            .filter(group => group.length >= 2)
            .map(group => group.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })))
            .sort((a, b) => a[0].localeCompare(b[0], undefined, { sensitivity: 'base' }));

        const output = [];
        pairGroups.forEach((group, index) => {
            output.push(`Associates ${index + 1}:`, ...group, '-------------------------', '');
        });
        
        if (output.length > 0) {
            output.pop();
            output.pop();
        }

        return output.join('\n');
    }

    function findModifiedExtensions(paths) {
        const uniquePaths = [...new Set(paths)];
        const filtered = uniquePaths.filter(path => {
            const lowerPath = path.toLowerCase();
            const extensionMatch = lowerPath.match(/\.([a-z0-9]+)$/);
            
            if (!extensionMatch) return false;
            
            const extension = extensionMatch[1];
            
            if (extension.startsWith('microsoft-') || extension.startsWith('shell')) {
                return false;
            }
            
            return !STANDARD_EXTENSIONS.includes(extension);
        });
        
        return sortPaths(filtered);
    }

    function countResultLines(result) {
        if (!result || result.trim() === '') return 0;
        return result.split('\n').filter(line => {
            const trimmed = line.trim();
            return trimmed !== '' && 
                   !trimmed.startsWith('Associates') && 
                   trimmed !== '-------------------------';
        }).length;
    }

    function processOutput(selectedOption, paths) {
        const processors = {
            'filter-sort': () => sortPaths(paths).join('\n'),
            'filter-sort-exe': () => filterByExtension(paths, '.exe').join('\n'),
            'filter-sort-dll': () => filterByExtension(paths, '.dll').join('\n'),
            'find-pairs': () => findPairs(paths),
            'modified-extensions': () => findModifiedExtensions(paths).join('\n')
        };

        return processors[selectedOption] ? processors[selectedOption]() : '';
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.getAttribute('data-tab'));
        });
    });

    csrss1Input.addEventListener('input', function() {
        updateIndicator(this, indicator1);
    });

    csrss2Input.addEventListener('input', function() {
        updateIndicator(this, indicator2);
    });

    resetButton.addEventListener('click', function() {
        csrss1Input.value = '';
        csrss2Input.value = '';
        indicator1.classList.remove('active');
        indicator2.classList.remove('active');
        outputContent.innerHTML = '';
        updateCountIndicator(0);
    });

    createButton.addEventListener('click', function() {
        const selectedOption = outputSelect.value;
        
        if (!selectedOption) {
            alert('Please choose an output option first.');
            return;
        }

        const combinedData = csrss1Input.value + '\n' + csrss2Input.value;
        const ignoreSystem = ignoreSystemCheckbox.checked;
        const allPaths = extractPaths(combinedData, ignoreSystem);
        const result = processOutput(selectedOption, allPaths);
        const count = countResultLines(result);

        outputContent.innerHTML = `<textarea class="text-input" readonly>${result}</textarea>`;
        updateCountIndicator(count);
        switchTab('output');
    });
});
